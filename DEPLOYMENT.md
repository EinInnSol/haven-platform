# 🚀 HAVEN Platform - Deployment Guide

## Prerequisites

1. **Cloudflare Account** (Free tier works!)
2. **Wrangler CLI** installed: `npm install -g wrangler`
3. **API Keys:**
   - Anthropic API key (for Claude models)
   - OpenAI API key (for GPT-4o Mini)

## Step-by-Step Deployment

### 1. Clone & Setup

```bash
git clone https://github.com/EinInnSol/haven-platform.git
cd haven-platform
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
# Create the database
wrangler d1 create haven_db

# Copy the database_id from output and update wrangler.toml
```

Update `wrangler.toml` with your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "haven_db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Update this
```

### 4. Initialize Database Schema

```bash
npm run db:init
```

### 5. Seed Initial Data (Optional)

Create a caseworker account for testing:

```bash
wrangler d1 execute haven_db --command="
INSERT INTO caseworkers (
  id, created_at, updated_at, name, email, password_hash, role, status
) VALUES (
  'demo-caseworker-001',
  $(date +%s)000,
  $(date +%s)000,
  'Demo Caseworker',
  'demo@einharjer.com',
  'demo-password-hash',
  'caseworker',
  'active'
)"
```

### 6. Set Environment Variables

```bash
# Set Anthropic API key
wrangler secret put ANTHROPIC_API_KEY
# Paste your key when prompted

# Set OpenAI API key
wrangler secret put OPENAI_API_KEY
# Paste your key when prompted
```

### 7. Deploy!

```bash
npm run deploy
```

Your API will be live at: `https://haven-platform.YOUR_SUBDOMAIN.workers.dev`

### 8. Test the Deployment

```bash
# Health check
curl https://haven-platform.YOUR_SUBDOMAIN.workers.dev/api/health

# Generate QR code
curl -X POST https://haven-platform.YOUR_SUBDOMAIN.workers.dev/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Main St & 5th Ave",
    "campaign_name": "Pilot Program",
    "caseworker_id": "demo-caseworker-001"
  }'
```

## 🎯 Nov 15 Demo Checklist

- [ ] Deploy to Cloudflare
- [ ] Create 2 caseworker accounts (you + your wife)
- [ ] Generate 5-10 test QR codes for demo locations
- [ ] Seed 3-5 demo client records with various risk levels
- [ ] Test full intake flow on mobile device
- [ ] Test caseworker dashboard
- [ ] Prepare demo script highlighting AI features

## 📱 Mobile Testing

The intake form is mobile-first. Test on:
- iPhone Safari
- Android Chrome
- Different screen sizes

QR code URL format:
```
https://haven-platform.YOUR_SUBDOMAIN.workers.dev/intake/QR_ID
```

## 🔒 Security Notes

- API keys are stored as Cloudflare secrets (never in code)
- Client data encrypted at rest in D1
- CORS enabled for web clients
- Rate limiting recommended for production

## 💰 Cost Estimates

**Cloudflare:**
- Workers: Free (100k requests/day)
- D1: Free (5GB storage, 5M reads/day)

**AI APIs (per 1000 clients):**
- Intake processing: ~$15 (Claude Sonnet)
- Daily briefings: ~$5 (Claude Sonnet)
- Documents: ~$2 (GPT-4o Mini)

**Total: ~$22/month for 1000 client intakes**

## 🐛 Troubleshooting

**"Database not found"**
- Run `npm run db:init` to create tables

**"Unauthorized" errors**
- Check API keys are set: `wrangler secret list`

**AI calls failing**
- Verify API keys have sufficient credits
- Check CloudFlare worker logs: `wrangler tail`

**CORS issues**
- Ensure frontend origin is allowed in worker.js

## 📊 Monitoring

View logs in real-time:
```bash
wrangler tail
```

Check D1 database:
```bash
wrangler d1 execute haven_db --command="SELECT COUNT(*) FROM clients"
```

## 🎨 Frontend (Coming Soon)

Mobile intake form and caseworker dashboard will be added to `/client` directory.

For now, you can test API endpoints directly or build a simple form that POSTs to `/api/intake/submit`.

---

**Questions?** Open an issue on GitHub or email: faernstromjames@gmail.com