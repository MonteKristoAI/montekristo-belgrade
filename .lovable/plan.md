

## Fix: TypeScript Build Error in Edge Function

**File:** `supabase/functions/form-submit/index.ts`, line 265

**Problem:** TypeScript strict mode treats caught errors as `unknown`, so accessing `error.message` directly fails.

**Fix:** Cast the error before accessing `.message`:

```typescript
// Line 265 - change from:
console.log('N8N webhook error (ignored):', error.message)

// To:
console.log('N8N webhook error (ignored):', error instanceof Error ? error.message : error)
```

This is a one-line change that resolves the build error with no functional impact.

