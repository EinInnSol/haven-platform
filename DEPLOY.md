# 🚀 HAVEN Platform Deployment Guide

Complete deployment instructions for Cloudflare Workers + D1 + Pages.

## Prerequisites

### 1. Accounts & Tools
- [ ] Cloudflare account (free tier works)
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Anthropic API key ([get one here](https://console.anthropic.com/))
- [ ] OpenAI API key (optional, [get here](https://platform.openai.com/))

### 2. Check Your Setup

```bash
# Verify Node.js
node --version  # Should be 18.x or higher

# Verify npm
npm --version
```

## Quick Deploy (Recommended)

### Option A: Automated Script

```bash
# Clone and enter repo
git clone https://github.com/EinInnSol/haven-platform.git
cd haven-platform

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script handles everything: dependencies, database, secrets, deployment.

### Option B: Manual Steps

Follow this if the automated script fails or you want more control.

## Manual Deployment Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser window. Authorize Wrangler to access your Cloudflare account.

### Step 3: Create D1 Database

```bash
# Create the database
npx wrangler d1 create haven_db
```

You'll get output like:
```
✅ Successfully created DB 'haven_db'
📋 Database ID: abc123-def456-ghi789
```

**IMPORTANT:** Copy the Database ID!

### Step 4: Update Configuration

Edit `wrangler.toml` and replace `YOUR_D1_DATABASE_ID` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "haven_db"
database_id = "abc123-def456-ghi789"  # ← Your actual ID here
```

### Step 5: Initialize Database

```bash
# Create tables
npx wrangler d1 execute haven_db --remote --file=./src/database/schema.sql

# Add demo data
npx wrangler d1 execute haven_db --remote --file=./src/database/seed.sql
```

### Step 6: Set API Keys

```bash
# Required: Anthropic API key
npx wrangler secret put ANTHROPIC_API_KEY
# Paste your key when prompted

# Optional: OpenAI API key (for GPT-4o mini support)
npx wrangler secret put OPENAI_API_KEY
# Paste your key when prompted
```

### Step 7: Deploy!

```bash
npm run deploy
```

You'll see output like:
```
✨ Built successfully
🚀 Deployed to https://haven-platform.your-account.workers.dev
```

**Save this URL!** This is your live platform.

## Verify Deployment

### Test the API

```bash
curl https://haven-platform.your-account.workers.dev/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-20T00:00:00.000Z"
}
```

### Test the Frontend

Visit in your browser:
```
https://haven-platform.your-account.workers.dev/
```

You should see the HAVEN home page with three options:
- Client Intake
- Caseworkers
- Municipal Analytics

## Post-Deployment Setup

### 1. Generate Demo QR Codes

1. Visit: `https://your-worker.workers.dev/admin`
2. Click "Generate New QR Code"
3. Copy the intake URL
4. Create 5-10 QR codes for different locations

### 2. Test the Intake Flow

1. Visit: `https://your-worker.workers.dev/intake/demo`
2. Complete the assessment (use fake data for testing)
3. Verify you get assigned to the demo caseworker
4. Check the confirmation screen

### 3. Test the Caseworker Dashboard

1. Visit: `https://your-worker.workers.dev/caseworker/demo`
2. Verify the dashboard loads
3. Click "Daily Briefing" - this will trigger AI generation
4. Check that your test client appears in the "Active Clients" list

### 4. Test Municipal Analytics

1. Visit: `https://your-worker.workers.dev/municipal`
2. Verify the dashboard loads
3. Stats will be zero until you have real intake data

## Troubleshooting

### Database Not Found Error

```
Error: D1_ERROR: no such table: clients
```

**Fix:** Re-run database initialization
```bash
npx wrangler d1 execute haven_db --remote --file=./src/database/schema.sql
npx wrangler d1 execute haven_db --remote --file=./src/database/seed.sql
```

### API Key Errors

```
Error: ANTHROPIC_API_KEY not configured
```

**Fix:** Set the secret
```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

### Frontend Not Loading

**Fix:** Make sure wrangler.toml has the correct assets configuration:
```toml
[site]
bucket = "./public"
```

If still broken, redeploy:
```bash
npm run deploy
```

### 404 Errors on Routes

The app uses client-side routing. Make sure you're accessing the correct URLs:
- ✅ `https://your-worker.workers.dev/`
- ✅ `https://your-worker.workers.dev/intake/demo`
- ❌ `https://your-worker.workers.dev/intake/demo.html`

## Local Development

Want to test locally before deploying?

```bash
# Start local dev server
npm run dev
```

Visit `http://localhost:8787`

**Note:** Local mode uses a local D1 database. Initialize it:
```bash
npm run db:local:init
npm run db:local:seed
```

## Updating the Platform

Made changes? Redeploy:

```bash
npm run deploy
```

Changes are live in ~10 seconds.

## Custom Domain (Optional)

Want `haven.yourdomain.com` instead of `*.workers.dev`?

1. Go to Cloudflare Dashboard
2. Workers & Pages → haven-platform
3. Settings → Triggers
4. Add Custom Domain
5. Enter your domain (must be on Cloudflare DNS)

## Cost Monitoring

### Check D1 Usage
```bash
npx wrangler d1 info haven_db
```

### Check Worker Usage
Go to: Cloudflare Dashboard → Workers & Pages → haven-platform → Metrics

### AI Cost Tracking
Visit: `https://your-worker.workers.dev/api/cost-summary`

## Security Best Practices

1. **Rotate API Keys** - Every 90 days
2. **Monitor Usage** - Check metrics weekly
3. **Review Logs** - Use `wrangler tail` to watch logs
4. **Restrict Admin Access** - Add authentication (future)
5. **Enable Rate Limiting** - Cloudflare dashboard settings

## Demo Day Preparation

### 1 Week Before
- [ ] Deploy to production
- [ ] Generate 10 demo QR codes
- [ ] Complete 5 test intakes
- [ ] Verify all dashboards work
- [ ] Test AI briefing generation
- [ ] Check mobile responsiveness

### 3 Days Before
- [ ] Print QR codes
- [ ] Prepare demo script
- [ ] Record backup video
- [ ] Test on multiple devices
- [ ] Verify internet connectivity plan

### Day Of
- [ ] Test all URLs work
- [ ] Have backup video ready
- [ ] Phone fully charged
- [ ] QR codes printed and laminated
- [ ] Know your worker URL by heart

## Getting Help

### Cloudflare Issues
- Docs: https://developers.cloudflare.com/workers/
- Community: https://community.cloudflare.com/
- Support: support@cloudflare.com

### Platform Issues
- GitHub Issues: https://github.com/EinInnSol/haven-platform/issues
- Email: james@einharjer.com

## Next Steps

After successful deployment:

1. **Generate QR Codes** - Create codes for different locations
2. **Seed Demo Data** - Add realistic test clients
3. **Test Everything** - Complete end-to-end testing
4. **Prepare Demo** - Practice your pitch
5. **Win That Contract** - Show them what HAVEN can do

---

**You're ready to deploy. Let's make this happen! 🚀**

*Questions? Check ARCHITECTURE.md for technical details.*
