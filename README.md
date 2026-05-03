# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4c93e081-c64d-4029-b9b2-6d1e2ba91c4d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4c93e081-c64d-4029-b9b2-6d1e2ba91c4d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4c93e081-c64d-4029-b9b2-6d1e2ba91c4d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Form → Airtable Integration

This project includes a secure contact form that integrates with Airtable and optional N8N webhooks.

### Required Environment Variables

The following secrets must be configured in your Supabase project:

- `AIRTABLE_TOKEN` - Your Airtable personal access token
- `AIRTABLE_BASE_ID` - The ID of your Airtable base (e.g., `appVLpqR0DWUB3Ss0`)
- `AIRTABLE_TABLE_ID` - The ID of your form submissions table (e.g., `tblSwgWKCteiWW2KJ`)
- `N8N_WEBHOOK_URL` - Optional N8N webhook URL for additional processing

### Airtable Table Structure

Your Airtable table should have these fields:

- **Name** (Single line text)
- **Work Email** (Email)
- **Company** (Single line text)
- **Bottleneck** (Single select with options):
  - Lead Outreach & Qualification
  - CRM Management & Updates
  - Content Creation & Distribution
  - Sales Process Optimization
  - Other
- **Notes** (Long text)
- **Submitted At** (Date & time)

### Security Features

- **Rate limiting**: 10 requests per minute per IP address
- **Honeypot protection**: Hidden field to detect bots
- **Input validation**: Comprehensive server-side validation
- **CORS protection**: Proper headers for web security
- **Error handling**: Graceful degradation with user-friendly messages

### Testing the Integration

You can test the form submission endpoint directly:

```bash
curl -X POST "https://kulcfydqylhvufevlcra.supabase.co/functions/v1/form-submit" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "email": "ada@example.com", 
    "company": "Analytical Engines",
    "bottleneck": "Lead Outreach & Qualification",
    "notes": "Excited to learn more about AI automation.",
    "website": ""
  }'
```

Expected response:
```json
{
  "ok": true
}
```

### Edge Function URL

The form submits to: `https://kulcfydqylhvufevlcra.supabase.co/functions/v1/form-submit`

### Running Tests

To run the Edge Function unit tests:

```bash
deno test supabase/functions/form-submit/_tests.ts --allow-env --allow-net
```

<!-- portal merged 2026-05-03 -->
