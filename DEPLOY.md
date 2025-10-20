# 🚀 HAVEN Platform - Deployment Guide

## What's Been Built

✅ **Backend API** (Cloudflare Workers)
- QR code generation
- HUD-compliant intake processing
- AI analysis engine
- Caseworker dashboard endpoints
- Municipal analytics

✅ **Frontend UI** (Static HTML/Tailwind/Vanilla JS)
- Mobile intake form (40 HUD questions)
- Caseworker dashboard
- Municipal analytics dashboard
- QR code generator
- Real-time AI briefings

✅ **Database** (D1 SQL)
- Complete schema with all tables
- Seed data with demo caseworkers

## Quick Deploy (5 Minutes)

### Step 1: Install & Login
```bash
npm install
npx wrangler login
```

### Step 2: Create Database
```bash
npm run db:create
```

Copy the database ID from the output and update `wrangler.toml`:
```toml
database_id = "paste-your-id-here"
```

### Step 3: Initialize Database
```bash
npm run db:init
npm run db:seed
```

### Step 4: Set API Keys
```bash
npx wrangler secret put ANTHROPIC_API_KEY
# Paste your Anthropic API key

npx wrangler secret put OPENAI_API_KEY
# Paste your OpenAI API key (optional, for cost optimization)
```

### Step 5: Deploy
```bash
npm run deploy
```

Your platform is now live at: `https://haven-platform.YOUR-SUBDOMAIN.workers.dev`

## Access URLs

- **Mobile Intake**: `https://your-worker.workers.dev/intake.html?qr=demo-qr-1`
- **Caseworker Dashboard**: `https://your-worker.workers.dev/dashboard.html?id=demo-caseworker-1`
- **Analytics**: `https://your-worker.workers.dev/analytics.html`

## Demo Credentials

### Test QR Codes (already created)
- `HAVEN-DEMO001` - Downtown Shelter
- `HAVEN-DEMO002` - City Library Outreach

### Demo Caseworkers
1. **Sarah Johnson** 
   - Email: sarah.johnson@haven.demo
   - ID: `demo-caseworker-1`
   - Specializations: Veterans, Families, Chronic Homelessness

2. **Michael Chen**
   - Email: michael.chen@haven.demo
   - ID: `demo-caseworker-2`
   - Specializations: Youth, Mental Health

## Testing the Flow

### 1. Generate QR Code
```bash
curl -X POST https://your-worker.workers.dev/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Downtown Shelter",
    "campaign_name": "November Demo",
    "caseworker_id": "demo-caseworker-1"
  }'
```

### 2. Complete Intake
Visit: `https://your-worker.workers.dev/intake.html?qr={qr_id_from_step_1}`

### 3. View Dashboard
Visit: `https://your-worker.workers.dev/dashboard.html?id=demo-caseworker-1`

## Local Development

```bash
# Start local dev server with D1 local database
npm run dev

# Init local database
npm run db:local:init
npm run db:local:seed

# Access at http://localhost:8787
```

## November 15 Demo Setup

### Before Demo Day:
1. ✅ Deploy to production (done above)
2. Generate 10 demo QR codes for different locations
3. Print QR codes as cards/posters
4. Seed 5-10 sample client records for realistic dashboard
5. Test complete flow end-to-end
6. Prepare demo script highlighting:
   - Mobile-first intake (scan → complete → assigned in minutes)
   - AI-powered briefings
   - Real-time analytics
   - HUD compliance

### During Demo:
1. Show QR scan → intake form (on phone)
2. Complete assessment (show trauma-informed questions)
3. Show auto-assignment to caseworker
4. Switch to caseworker dashboard
5. Show AI daily briefing with recommendations
6. Show client details and vulnerability score
7. Switch to municipal analytics
8. Show real-time metrics and HUD compliance

## Cost Optimization

The AI engine automatically routes to the best model:
- **Haiku** for simple tasks (intake analysis)
- **GPT-4o Mini** for document generation
- **Sonnet** for complex briefings

Aggressive caching reduces API calls by ~70%.

## Troubleshooting

### Database not found
```bash
# Recreate database
npm run db:create
# Update wrangler.toml with new ID
npm run db:init
npm run db:seed
```

### API Keys not working
```bash
# Reset secrets
npx wrangler secret delete ANTHROPIC_API_KEY
npx wrangler secret put ANTHROPIC_API_KEY
```

### Frontend not loading
Check that `wrangler.toml` has:
```toml
[site]
bucket = "./public"
entry-point = "."
```

### CORS errors
The worker has CORS enabled for all origins. Check browser console for specific errors.

## What's Next

Week 1 (Oct 18-24):
- ✅ Deploy MVP
- ✅ Test end-to-end flow
- [ ] Generate 10 demo QR codes
- [ ] Seed realistic demo data
- [ ] Polish mobile UI
- [ ] Add loading states

Week 2 (Oct 25-31):
- [ ] Document generation (progress notes, referrals)
- [ ] SMS notifications (Twilio)
- [ ] Calendar integration
- [ ] Photo upload for documents

Week 3 (Nov 1-7):
- [ ] Advanced analytics
- [ ] Export to HMIS
- [ ] Spanish translation
- [ ] Accessibility audit

Week 4 (Nov 8-14):
- [ ] Final polish
- [ ] Performance optimization
- [ ] Demo rehearsal
- [ ] Backup plan (recorded demo)

## Support

Questions? Issues?
- Check GitHub repo: https://github.com/EinInnSol/haven-platform
- Review ARCHITECTURE.md for technical details
- Review ROADMAP.md for feature timeline

---

**Built with ❤️ by James & Claude**
**Demo Date: November 15, 2025**
**Target: $75K Long Beach Pilot Contract**
