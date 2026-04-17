#!/usr/bin/env bash
# Deploy all MK onboarding edge functions to the tydafqhnzxmrpnclaxnl Supabase project.
# Requires: supabase CLI authenticated, ANTHROPIC_API_KEY secret set.
#
# Usage:
#   cd /Users/milanmandic/Desktop/montekristo-web-forge/supabase/functions
#   ./deploy-edge-fns.sh

set -euo pipefail

PROJECT_REF="tydafqhnzxmrpnclaxnl"
FNS=(mk-ai-chat mk-growth-ideas mk-meeting-prep mk-enrich-web)

for fn in "${FNS[@]}"; do
  echo ""
  echo "=== Deploying $fn ==="
  supabase functions deploy "$fn" --project-ref "$PROJECT_REF"
done

echo ""
echo "Done. Verify:"
for fn in "${FNS[@]}"; do
  echo "  curl -sSfI https://${PROJECT_REF}.supabase.co/functions/v1/${fn}"
done
