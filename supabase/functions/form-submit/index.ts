import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers for web app requests - restrict to known origins
const ALLOWED_ORIGINS = [
  'https://montekristoai.com',
  'https://www.montekristoai.com',
  'https://montekristobelgrade.com',
  'https://www.montekristobelgrade.com',
  // Allow Lovable preview subdomains during development
  /^https:\/\/.*\.lovableproject\.com$/,
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// In-memory rate limiting store (per instance)
const rateLimitStore = new Map<string, { attempts: number[], lastCleanup: number }>()

// Rate limiting configuration
const RATE_LIMIT_MAX_ATTEMPTS = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

// Input validation schemas
const BOTTLENECK_VALUES = [
  "Lead Outreach & Qualification",
  "CRM Management & Updates", 
  "Content Creation & Distribution",
  "Sales Process Optimization",
  "Other"
] as const

interface FormSubmission {
  name: string
  email: string
  company: string
  bottleneck: string
  notes?: string
  website?: string // Honeypot field
}

// Extract client IP for rate limiting - prioritize trusted sources
function getClientIP(request: Request): string {
  // Prefer Cloudflare's connecting IP (most trusted)
  const cfConnecting = request.headers.get('cf-connecting-ip')
  if (cfConnecting) return cfConnecting
  
  // Fall back to X-Real-IP (nginx/proxy)
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP
  
  // Last resort: parse X-Forwarded-For (less reliable)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // Take the first IP, but be aware this can be spoofed
    return forwarded.split(',')[0].trim()
  }
  
  return 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = `ip:${ip}`
  
  // Clean up old entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [k, data] of rateLimitStore.entries()) {
      if (now - data.lastCleanup > CLEANUP_INTERVAL_MS) {
        rateLimitStore.delete(k)
      }
    }
  }
  
  const existing = rateLimitStore.get(key) || { attempts: [], lastCleanup: now }
  
  // Remove attempts outside the window
  const validAttempts = existing.attempts.filter(timestamp => 
    now - timestamp < RATE_LIMIT_WINDOW_MS
  )
  
  if (validAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false
  }
  
  // Record this attempt
  validAttempts.push(now)
  rateLimitStore.set(key, { attempts: validAttempts, lastCleanup: now })
  
  return true
}

function validateInput(data: FormSubmission): { valid: boolean; error?: string } {
  // Honeypot check - if website field is filled, it's a bot
  if (data.website && data.website.trim() !== '') {
    return { valid: false, error: 'Bot detected' }
  }
  
  // Sanitize and validate name
  const name = data.name?.trim()
  if (!name || name.length < 2 || name.length > 120) {
    return { valid: false, error: 'Name must be 2-120 characters' }
  }
  if (!/^[a-zA-Z\s\-'\.À-ÿ]+$/.test(name)) {
    return { valid: false, error: 'Name contains invalid characters' }
  }
  
  // Validate email
  const email = data.email?.trim().toLowerCase()
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!email || !emailRegex.test(email) || email.length > 254) {
    return { valid: false, error: 'Invalid email address' }
  }
  
  // Validate company
  const company = data.company?.trim()
  if (!company || company.length < 2 || company.length > 200) {
    return { valid: false, error: 'Company name must be 2-200 characters' }
  }
  
  // Validate bottleneck
  if (!data.bottleneck || !BOTTLENECK_VALUES.includes(data.bottleneck as any)) {
    return { valid: false, error: 'Invalid bottleneck selection' }
  }
  
  // Validate notes (optional)
  if (data.notes && data.notes.length > 2000) {
    return { valid: false, error: 'Notes must be less than 2000 characters' }
  }
  
  return { valid: true }
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

async function createAirtableRecord(data: FormSubmission): Promise<{ success: boolean; recordId?: string; error?: string }> {
  const airtableToken = Deno.env.get('AIRTABLE_TOKEN')
  const baseId = Deno.env.get('AIRTABLE_BASE_ID')
  const tableId = Deno.env.get('AIRTABLE_TABLE_ID')
  
  if (!airtableToken || !baseId || !tableId) {
    console.error('Missing Airtable configuration')
    return { success: false, error: 'Server configuration error' }
  }
  
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}`
  
  // Redact PII from logs - only log sanitized/truncated versions
  const logSafeData = {
    name: data.name.substring(0, 3) + '***',
    email: data.email.split('@')[0].substring(0, 2) + '***@' + data.email.split('@')[1],
    company: data.company.substring(0, 5) + '***',
    bottleneck: data.bottleneck
  }
  console.log('Creating Airtable record for:', logSafeData)
  
  const payload = {
    records: [{
      fields: {
        "Name": sanitizeInput(data.name),
        "Work Email": sanitizeInput(data.email.toLowerCase()),
        "Company": sanitizeInput(data.company),
        "Bottleneck": data.bottleneck,
        "Notes": data.notes ? sanitizeInput(data.notes) : ""
        // Removed "Submitted At" field - causing Airtable 422 error
      }
    }]
  }
  
  const makeRequest = async (attempt: number = 1): Promise<{ success: boolean; recordId?: string; error?: string }> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (response.status === 429 && attempt === 1) {
        // Rate limited, wait and retry once
        console.log('Airtable rate limit hit, retrying after 1s...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        return makeRequest(2)
      }
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Airtable API error (${response.status}):`, errorText)
        
        if (response.status === 422) {
          return { success: false, error: 'Please check your information and try again.' }
        }
        
        return { success: false, error: 'Failed to save form submission' }
      }
      
      const result = await response.json()
      const recordId = result.records?.[0]?.id
      
      console.log('Successfully created Airtable record with ID ending in:', recordId?.slice(-4))
      return { success: true, recordId }
      
    } catch (error) {
      console.error('Airtable request failed:', error)
      return { success: false, error: 'Network error while saving form' }
    }
  }
  
  return makeRequest()
}

async function triggerN8NWebhook(data: FormSubmission, airtableRecordId: string): Promise<void> {
  const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
  if (!webhookUrl) return
  
  try {
    // Redact PII for webhook payload logging
    const logSafePayload = {
      name: data.name.substring(0, 3) + '***',
      email: data.email.split('@')[0].substring(0, 2) + '***@' + data.email.split('@')[1],
      company: data.company.substring(0, 5) + '***',
      bottleneck: data.bottleneck,
      airtableRecordId: airtableRecordId.slice(-4),
      timestamp: new Date().toISOString()
    }
    console.log('Triggering N8N webhook with:', logSafePayload)
    
    const payload = {
      ...data,
      airtableRecordId,
      timestamp: new Date().toISOString()
    }
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      console.log('N8N webhook triggered successfully')
    } else {
      console.log('N8N webhook failed:', response.status)
    }
  } catch (error) {
    // Silent failure for webhook - don't affect main form submission
    console.log('N8N webhook error (ignored):', error instanceof Error ? error.message : error)
  }
}

// Check origin for security
function checkOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  
  if (!origin && !referer) return false
  
  const checkURL = origin || new URL(referer!).origin
  
  return ALLOWED_ORIGINS.some(allowed => {
    if (typeof allowed === 'string') {
      return allowed === checkURL
    }
    return allowed.test(checkURL)
  })
}

serve(async (req) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const ip = getClientIP(req)
  const origin = req.headers.get('origin')
  
  // Redact IP for privacy (log only last octet for IPv4)
  const logSafeIP = ip.includes('.') ? ip.split('.').slice(0, 3).join('.') + '.***' : ip.substring(0, 8) + '***'
  console.log(`${timestamp} - ${method} request from ${logSafeIP}, origin: ${origin}`)

  // Set CORS origin based on request origin
  if (origin && ALLOWED_ORIGINS.some(allowed => 
    typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
  )) {
    corsHeaders['Access-Control-Allow-Origin'] = origin
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  if (req.method !== 'POST') {
    console.log(`Method not allowed: ${method}`)
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Check origin for additional security
  if (!checkOrigin(req)) {
    console.log(`Blocked request from unauthorized origin: ${origin || 'none'}`)
    return new Response('Forbidden', { 
      status: 403, 
      headers: corsHeaders 
    })
  }
  
  try {
    // Rate limiting
    if (!checkRateLimit(ip)) {
      console.log(`Rate limit exceeded for IP: ${ip}`)
      return new Response(
        JSON.stringify({ ok: false, error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Parse request body
    let formData: FormSubmission
    try {
      formData = await req.json()
    } catch (error) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Validate input
    const validation = validateInput(formData)
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ ok: false, error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create Airtable record
    const airtableResult = await createAirtableRecord(formData)
    if (!airtableResult.success) {
      // Return 400 for client errors (422 from Airtable), 500 for server errors
      const statusCode = airtableResult.error?.includes('check your information') ? 400 : 500
      return new Response(
        JSON.stringify({ ok: false, error: airtableResult.error }),
        { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Trigger N8N webhook (optional, non-blocking)
    if (airtableResult.recordId) {
      triggerN8NWebhook(formData, airtableResult.recordId).catch(() => {
        // Errors are already logged in the function
      })
    }
    
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Unhandled error in form-submit function:', error)
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})