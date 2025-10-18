# 🏗️ HAVEN Platform - Technical Architecture

## System Overview

HAVEN is a serverless, AI-powered homeless services platform built on Cloudflare's edge infrastructure. It provides HUD-compliant intake, intelligent case management, and municipal analytics.

## Architecture Diagram

```
┌─────────────────┐
│   QR Codes on   │
│  Bus Benches &  │ ─┐
│     Walls       │  │
└─────────────────┘  │
                     │ Scan
                     ▼
┌──────────────────────────────────────────────────┐
│                  MOBILE CLIENT                   │
│  ┌────────────────────────────────────────────┐ │
│  │   40-Question HUD Assessment Form          │ │
│  │   (Mobile-First, Trauma-Informed UI)       │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
                     │
                     │ HTTPS/JSON
                     ▼
┌──────────────────────────────────────────────────┐
│          CLOUDFLARE WORKERS (Edge API)           │
│  ┌────────────────────────────────────────────┐ │
│  │  Intake API  │  Caseworker API  │  AI API  │ │
│  │  /api/intake │  /api/caseworker │  /api/ai │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
         │                  │                  │
         │                  │                  │
    ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
    │   D1    │        │  R2     │       │   KV    │
    │Database │        │Storage  │       │  Cache  │
    └─────────┘        └─────────┘       └─────────┘
         │
         │ Query
         ▼
┌──────────────────────────────────────────────────┐
│              AI ENGINE (Multi-Model)              │
│  ┌────────────────────────────────────────────┐ │
│  │ Smart Router: Task → Best Model           │ │
│  │  • Triage → Haiku ($0.80/M)               │ │
│  │  • Analysis → Sonnet 4 ($3/M)             │ │
│  │  • Documents → GPT-4o Mini ($0.15/M)      │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
         │
         │ Recommendations
         ▼
┌──────────────────────────────────────────────────┐
│          CASEWORKER DASHBOARD (Web)              │
│  ┌────────────────────────────────────────────┐ │
│  │  • Daily AI Briefing                       │ │
│  │  • Priority Client List                    │ │
│  │  • Auto-Generated Documents                │ │
│  │  • Housing Recommendations                 │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│          MUNICIPAL DASHBOARD (Web)               │
│  ┌────────────────────────────────────────────┐ │
│  │  • System Analytics                        │ │
│  │  • Trend Identification                    │ │
│  │  • Resource Optimization                   │ │
│  │  • HUD Compliance Reporting                │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

## Technology Stack

### Infrastructure (Cloudflare)
- **Workers:** Serverless API runtime at the edge
- **D1:** SQLite-based serverless SQL database
- **R2:** Object storage for documents/files
- **KV:** Low-latency key-value cache
- **Pages:** Static site hosting for frontends

### AI Models
- **Claude Sonnet 4:** Complex reasoning, case analysis ($3/M input, $15/M output)
- **Claude Haiku:** Fast triage, classification ($0.80/M input, $4/M output)
- **GPT-4o Mini:** Document generation ($0.15/M input, $0.60/M output)

### Frontend
- **React:** Component-based UI
- **Tailwind CSS:** Utility-first styling
- **Mobile-First:** Progressive enhancement

## Data Flow

### 1. Client Intake Flow
```
1. Client scans QR code
2. Mobile form loads with session ID
3. Client completes 40-question assessment
4. POST /api/intake/submit with responses
5. Worker calculates vulnerability score
6. AI analyzes responses → recommendations
7. Auto-assign to available caseworker
8. Update caseworker caseload
9. Send confirmation with contact info
```

### 2. Daily Caseworker Briefing
```
1. Caseworker logs in
2. GET /api/caseworker/:id/briefing
3. Worker queries active cases
4. Identify priority clients (high risk, urgent)
5. AI generates personalized briefing
6. Display: top priorities, schedule, quick wins
```

### 3. Document Generation
```
1. Caseworker requests document
2. POST /api/document/generate {type, data}
3. AI selects template + generates content
4. Return formatted document (PDF/Word)
5. Auto-save to case notes
```

## Database Schema Summary

### Core Tables
- **clients:** Client demographics, housing status, assessments
- **caseworkers:** Staff info, specializations, availability
- **assignments:** Client-caseworker pairings, goals, progress
- **case_notes:** Interaction logs, AI suggestions, outcomes
- **resources:** Housing programs, eligibility, availability
- **referrals:** Service connections, status tracking
- **qr_codes:** Intake QR codes, location, scan tracking

### Analytics Tables
- **analytics_snapshots:** Daily system metrics for trends
- **intake_sessions:** Track incomplete assessments

## AI Engine Design

### Smart Routing Logic
```javascript
TASK TYPE          → MODEL           → USE CASE
---------------------------------------------------------
TRIAGE            → Haiku           → Quick classification
CLASSIFICATION    → Haiku           → Priority assignment
INTAKE_ANALYSIS   → Sonnet 4        → Deep case analysis
STRATEGIC_PLAN    → Sonnet 4        → Housing strategy
DOCUMENT          → GPT-4o Mini     → Letters, reports
SUMMARY           → GPT-4o Mini     → Case summaries
```

### Cost Optimization
1. **Aggressive Caching:** 5-minute TTL for repeated queries
2. **Smart Routing:** Use cheapest model that can handle task
3. **Batch Processing:** Combine multiple small tasks
4. **Token Limits:** Cap output tokens based on need

### Example Costs (1000 Clients/Month)
- Intake processing: 1000 × $0.015 = $15
- Daily briefings: 30 × 30 × $0.005 = $4.50
- Documents: 2000 × $0.001 = $2
- **Total AI: ~$21.50/month**

## Security & Compliance

### Data Protection
- TLS 1.3 for all API traffic
- Encrypted at rest in D1
- API key rotation every 90 days
- Rate limiting on intake endpoints

### HUD Compliance
- All 40 questions mapped to HUD fields
- VI-SPDAT scoring methodology
- HMIS-compatible data structure
- Coordinated Entry requirements met

### Privacy
- Minimal PII collection
- Optional SSN (last 4 only)
- Client consent tracked
- HIPAA-aligned practices

## Scalability

### Current Limits (Free Tier)
- 100k Worker requests/day
- 5GB D1 storage
- 5M D1 reads/day
- Plenty for pilot program

### Growth Path
- **100 clients/month:** Free tier sufficient
- **1,000 clients/month:** ~$20/month AI + $5 Cloudflare
- **10,000 clients/month:** ~$200/month AI + $25 Cloudflare
- **100,000 clients/month:** ~$2000/month AI + $200 Cloudflare

## Deployment Strategy

### Environments
1. **Development:** Local Wrangler dev server
2. **Staging:** `haven-staging.workers.dev`
3. **Production:** `haven.workers.dev` → Custom domain

### CI/CD Pipeline
```
GitHub → Cloudflare Integration → Auto-deploy on push to main
```

### Monitoring
- Cloudflare Analytics Dashboard
- Worker logs via `wrangler tail`
- D1 query performance metrics
- AI cost tracking in-app

## Future Enhancements

### Phase 2 (Post-Demo)
- [ ] SMS notifications via Twilio
- [ ] Calendar integration for appointments
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Spanish priority)

### Phase 3 (Scale)
- [ ] HMIS integration
- [ ] Advanced analytics with BigQuery
- [ ] Machine learning for housing predictions
- [ ] Multi-tenant (support multiple cities)

---

**Built with ❤️ by Einharjer Innovative Solutions LLC**