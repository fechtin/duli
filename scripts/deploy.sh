#!/usr/bin/env bash
# One-shot Cloudflare deploy: create+seed D1, build, deploy the Worker + SPA.
# Requires .env with CLOUDFLARE_API_TOKEN (needs Workers + D1 edit) and CLOUDFLARE_ACCOUNT_ID.
#
#   bash scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

set -a; source .env; set +a
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID

echo "▸ Ensuring D1 database 'atlas_db' exists…"
ID=$(npx wrangler d1 list --json 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);const m=a.find(x=>x.name==="atlas_db");process.stdout.write(m?(m.uuid||m.database_id||""):"")}catch{process.stdout.write("")}})' || true)
if [ -z "$ID" ]; then
  echo "▸ Creating D1 database…"
  OUT=$(npx wrangler d1 create atlas_db)
  ID=$(printf "%s" "$OUT" | grep -oiE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
fi
echo "▸ D1 database_id: $ID"

echo "▸ Pinning database_id in wrangler.toml…"
# macOS/BSD + GNU sed compatible
sed -i.bak -E "s/database_id = \"[^\"]*\"/database_id = \"$ID\"/" wrangler.toml && rm -f wrangler.toml.bak

echo "▸ Applying migrations (remote)…"
npx wrangler d1 migrations apply atlas_db --remote

echo "▸ Seeding content (remote)…"
npx wrangler d1 execute atlas_db --remote --file=db/seed.sql

echo "▸ Building SPA…"
npm run build

echo "▸ Deploying Worker + assets…"
npx wrangler deploy

echo "✅ Done. Your site is live on the *.workers.dev URL printed above."
