# GinaHoangMoore.com - KC SNAP & Food Security Data Platform

## Project Overview

**Domain:** ginahoangmoore.com
**Purpose:** Interactive, exploratory website providing comprehensive Kansas City metro SNAP benefit assistance, food security data, and community resource navigation
**Status:** Planning & Data Collection Phase
**Launch Target:** TBD

---

## Mission Statement

Create an authoritative, accessible, and real-time information hub for Kansas City metro residents, aid workers, policymakers, and community organizations to:

1. **Discover** - Find immediate food, utility, and financial assistance resources
2. **Understand** - Explore data-driven insights on food insecurity, SNAP participation, and poverty metrics
3. **Navigate** - Access interactive tools to locate services by ZIP code, eligibility, and need type
4. **Advocate** - Empower community action with verified statistics and impact visualizations
5. **Monitor** - Track crisis response effectiveness and resource availability in real-time

---

## Technical Infrastructure

### Available Resources

#### Cloudflare Stack
- **Cloudflare Workers** - Edge computing for dynamic content
- **Cloudflare Database** - D1 (SQL) or Workers KV (key-value) storage
- **Cloudflare Pages** - Static site hosting with Workers integration
- **Cloudflare Tunnel** - Secure server-to-cloud connectivity
- **Zone ID:** `d145a1a0944a9f9e391155098e9abc75`
- **API Token:** Available in `/home/ubuntu/.env`

#### Local Server
- **Ubuntu 24.04 LTS** - Can host backend services
- **Docker** - Containerized service deployment
- **Cloudflare Tunnel** - Route local services through Cloudflare
- **Location:** `/home/ubuntu/ginahoangmoore.com/`

#### Hosting Options
1. **Cloudflare Pages** (recommended for static/JAMstack)
2. **Self-hosted + Cloudflare Tunnel** (for dynamic backends)
3. **Hybrid** - Pages frontend + Workers API + D1 Database

---

## Data Sources & Collection Strategy

### Tier 1: Primary Official Data Sources

#### Federal Data
- **USDA Food & Nutrition Service (FNS)**
  - URL: https://www.fns.usda.gov/data-research
  - Data: National SNAP participation, payment totals, historical trends
  - Format: CSV, Excel, API (limited)
  - Refresh: Monthly

- **U.S. Census Bureau - American Community Survey (ACS)**
  - URL: https://data.census.gov/table/ACSST5Y2022.S2201
  - Data: SNAP households by county/tract, demographics, income
  - Format: CSV, JSON (via API)
  - Refresh: Annual (5-year estimates)
  - **API Key Required:** Yes (free from census.gov)

#### Missouri State Data
- **Missouri Department of Social Services - Family Support Division**
  - URL: https://dss.mo.gov/fsd/fstamp/
  - Data: Monthly SNAP caseloads, benefits value, applications
  - Counties: Jackson, Clay, Platte (KC Metro)
  - Format: PDF reports, Excel (needs scraping)
  - Refresh: Monthly

#### Kansas State Data
- **Kansas DCF - Economic & Employment Services**
  - URL: https://www.dcf.ks.gov/services/ees/Pages/default.aspx
  - Data: SNAP household counts, average benefit amounts
  - Counties: Johnson, Wyandotte (KC Metro)
  - Format: PDF reports, Excel
  - Refresh: Monthly

### Tier 2: Regional & Local Data

#### Mid-America Regional Council (MARC)
- **URL:** https://www.marc.org
- **Data:** Regional poverty indicators, food access, economic security dashboards
- **Coverage:** 9-county KC metro (MO/KS)
- **Format:** Interactive dashboards, PDF reports
- **Refresh:** Quarterly/Annual
- **Priority Pages:**
  - Data & Research → Regional Indicators
  - Community Data Profiles

#### Feeding America + Harvesters
- **Feeding America Map the Meal Gap:** https://map.feedingamerica.org
- **Harvesters:** https://www.harvesters.org
- **Data:**
  - Food insecurity rates (overall & child)
  - Meal gap estimates
  - Cost-of-food burden
  - Pantry distribution data
- **Coverage:** County-level, some ZIP code data
- **Format:** Interactive maps, CSV downloads
- **Refresh:** Annual (Map the Meal Gap)

#### Kansas City Health Departments
- **KCMO Health Department**
  - URL: https://www.kcmo.gov/city-hall/departments/health
  - Data: Community Health Assessment, social determinants
  - Format: PDF reports, dashboards

- **Unified Government of Wyandotte County Public Health**
  - URL: https://www.wycokck.org/Departments/Health
  - Data: Community indicators dashboard
  - Format: Interactive dashboard

### Tier 3: University & Research Data

#### UMKC - Urban Studies / Health Policy
- **URL:** https://www.umkc.edu
- **Data:** Metro hunger & equity research reports
- **Format:** Academic papers, policy briefs

#### Kansas Health Matters
- **URL:** https://www.kansashealthmatters.org
- **Data:** Metro-focused health & food security indicators
- **Format:** Interactive dashboards, downloadable reports

### Tier 4: Real-Time & Community Data

#### Local News Sources
- Kansas City Star
- KCUR (NPR)
- KSHB, KCTV5
- **Purpose:** Real-time crisis updates, community impact stories
- **Integration:** RSS feeds, web scraping for crisis alerts

#### Community Agencies
- **United Way 211 KC**
  - Potential API partnership for real-time resource availability
  - Referral volume data (request access)

- **Harvesters Network**
  - Mobile distribution schedules
  - Pantry capacity/hours updates

---

## Data Collection Infrastructure

### Phase 1: Data Pipeline (Current Phase)

#### Automated Collection
```
┌─────────────────┐
│  Data Sources   │
│  (APIs/Scrape)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare      │
│ Workers         │
│ (ETL Scripts)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare D1   │
│ Database        │
│ (Storage)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare      │
│ Pages Site      │
│ (Frontend)      │
└─────────────────┘
```

#### Data Tables (Initial Schema)

**snap_participation**
- id, county, state, month, year, households, individuals, total_benefits, avg_benefit, data_source, updated_at

**food_insecurity**
- id, county, state, year, overall_rate, child_rate, meal_gap, cost_per_meal, data_source, updated_at

**resources**
- id, name, category, address, city, state, zip, phone, hours, eligibility, notes, geolocation, verified_at, data_source

**resource_categories**
- id, name, parent_category, icon, color

**zipcodes**
- zip, city, county, state, latitude, longitude, poverty_rate, median_income

**crisis_updates**
- id, title, summary, impact, date, source_url, severity, active

### Phase 2: Interactive Features

#### Core Features (Priority 1)
1. **Resource Finder**
   - ZIP code search
   - Filter by: food, utility, housing, mental health
   - Real-time availability (if API available)
   - Mobile-friendly map view
   - "Get Directions" integration

2. **Data Explorer**
   - County-level SNAP participation trends
   - Food insecurity rate comparisons
   - Interactive charts (Chart.js or D3.js)
   - Downloadable CSV/PDF reports

3. **Crisis Dashboard**
   - Current SNAP status alerts
   - Agency capacity indicators
   - Recent news feed
   - Emergency contact quick-dial

4. **Eligibility Estimator**
   - Simple income/household size calculator
   - Estimated SNAP benefit amount
   - Program eligibility checker (SNAP, WIC, LIHEAP, etc.)
   - "Next Steps" guidance

#### Enhanced Features (Priority 2)
1. **Mobile App (PWA)**
   - Offline resource access
   - Push notifications for crisis updates
   - GPS-based "nearest pantry" locator

2. **Multi-Language Support**
   - Spanish (priority)
   - Additional languages based on KC metro demographics

3. **Volunteer/Donor Portal**
   - Pantry needs in real-time
   - Donation impact calculator
   - Volunteer opportunity listings

4. **Agency Dashboard**
   - Resource providers can update their info
   - Capacity reporting
   - Referral tracking

---

## Technology Stack (Recommended)

### Frontend
- **Framework:** Next.js (React) or SvelteKit
- **Styling:** Tailwind CSS
- **Maps:** Mapbox GL JS or Leaflet
- **Charts:** Chart.js or Recharts
- **Hosting:** Cloudflare Pages

### Backend
- **API Layer:** Cloudflare Workers (TypeScript)
- **Database:** Cloudflare D1 (SQLite)
- **Cron Jobs:** Cloudflare Workers Cron Triggers (data refresh)
- **Cache:** Cloudflare KV (for frequently accessed data)

### Data Pipeline
- **Scraping:** Cheerio/Puppeteer (via Worker or scheduled local script)
- **ETL:** Cloudflare Workers (scheduled)
- **APIs:** Axios/Fetch for external data sources
- **Storage:** D1 (structured) + R2 (PDFs/large files)

### Infrastructure
- **DNS:** Cloudflare
- **SSL:** Cloudflare automatic
- **CDN:** Cloudflare global network
- **Analytics:** Cloudflare Web Analytics (privacy-friendly)

---

## Data Collection Priorities

### Immediate (Week 1-2)
- [ ] Set up Cloudflare D1 database
- [ ] Create initial schema (tables above)
- [ ] Manual data import: verified resources from REVISED.md
- [ ] Set up Census API access (free API key)
- [ ] Scrape/download latest MO DSS + KS DCF SNAP reports
- [ ] Import Feeding America Map the Meal Gap data

### Short-term (Week 3-4)
- [ ] Build Cloudflare Worker ETL for Census API
- [ ] Automate MO/KS state report parsing (PDF → DB)
- [ ] Scrape MARC regional indicators
- [ ] Import Harvesters pantry locations + mobile schedule
- [ ] Set up resource verification workflow

### Medium-term (Month 2)
- [ ] Integrate United Way 211 data (partnership request)
- [ ] Automate news feed aggregation (KCUR, KC Star RSS)
- [ ] Build resource provider submission form
- [ ] Create data quality monitoring
- [ ] Set up automated backups

---

## Website Structure (Sitemap)

```
ginahoangmoore.com/
│
├── / (Home)
│   ├── Crisis Alert Banner (if active)
│   ├── Quick Resource Finder (ZIP search)
│   ├── Key Stats Dashboard
│   └── Get Help / Give Help CTAs
│
├── /resources
│   ├── /food
│   ├── /utilities
│   ├── /housing
│   ├── /mental-health
│   └── /map (interactive resource map)
│
├── /data
│   ├── /snap-participation
│   ├── /food-insecurity
│   ├── /demographics
│   └── /reports (downloadable PDFs/CSVs)
│
├── /eligibility
│   └── Interactive calculator + program guides
│
├── /crisis
│   └── Current crisis info (Nov 2025 SNAP lapse, etc.)
│
├── /get-involved
│   ├── /volunteer
│   ├── /donate
│   └── /advocate
│
├── /providers
│   └── Resource provider portal (update info, report capacity)
│
├── /about
│   ├── Data sources & methodology
│   ├── Contact
│   └── Privacy policy
│
└── /api (Cloudflare Workers endpoints)
    ├── /resources (GET, POST)
    ├── /snap-data (GET)
    ├── /search (ZIP/address lookup)
    └── /eligibility (calculator)
```

---

## Design Principles

### Accessibility First
- WCAG 2.1 AA compliance minimum
- Screen reader optimized
- High contrast mode
- Large touch targets for mobile
- Simple language (6th-grade reading level)

### Mobile-First
- 70%+ of users likely on mobile
- Offline-capable (service worker)
- Fast load times (<2s)
- Thumb-friendly navigation

### Trust & Credibility
- Clear data sourcing
- Last updated timestamps
- Contact information prominent
- No ads or tracking (privacy-focused)
- HTTPS only

### Crisis-Optimized
- Critical info above the fold
- One-tap calling
- Emergency mode UI (high contrast, simplified)
- Multilingual support

---

## Success Metrics

### Usage Metrics
- Unique visitors/month
- Resource searches/month
- Mobile vs. desktop split
- Most searched ZIP codes
- Top resource categories

### Impact Metrics
- Resources discovered → used (if trackable)
- Provider sign-ups
- Data downloads
- Average session duration
- Return visitor rate

### Data Quality Metrics
- Data freshness (days since last update)
- Resource verification rate
- User-reported corrections/month
- Uptime (target: 99.9%)

---

## Budget & Resources

### Costs (Estimated)
- **Cloudflare:** $0 (Free tier sufficient for launch)
- **Domain:** $12/year (already owned)
- **Census API:** $0 (free)
- **Development:** Volunteer/self-built
- **Total:** ~$0-20/month

### Time Investment
- **Phase 1 (MVP):** 40-60 hours
- **Phase 2 (Full features):** 80-120 hours
- **Ongoing maintenance:** 4-8 hours/month

---

## Next Steps (Action Items)

### Immediate Tasks
1. **Data Audit** - Systematically visit all Tier 1-2 sources, document available data formats
2. **Schema Finalization** - Refine D1 database tables based on actual data structure
3. **Cloudflare Setup** - Initialize D1 database, test Workers deployment
4. **Manual Data Import** - Load verified resources from REVISED.md into database
5. **Census API Registration** - Get API key, test data retrieval for KC counties

### Technical Setup
1. Create `/home/ubuntu/ginahoangmoore.com/src/` for source code
2. Initialize Git repository
3. Set up local development environment (Node.js, Wrangler CLI)
4. Configure Cloudflare Workers project
5. Create initial D1 database schema

### Content Creation
1. Draft homepage copy (crisis-aware, empathetic tone)
2. Create resource category taxonomy
3. Write eligibility calculator questions
4. Prepare "About" page content (methodology, sources)

---

## Data Collection Workflow

### Automated (Daily/Weekly)
```bash
# Cloudflare Worker Cron Trigger
# Runs: Daily at 6 AM CT
# Tasks:
# - Fetch Census API data (weekly)
# - Scrape news feeds (daily)
# - Check Harvesters mobile schedule (daily)
# - Validate resource links (weekly)
```

### Manual (Monthly)
- Download MO DSS + KS DCF SNAP reports
- Update Feeding America Map the Meal Gap data (annual)
- Review and verify resource contact information
- Update crisis status if applicable

### Community-Contributed
- Resource providers submit updates via form
- Users report outdated information (flagging system)
- Volunteer fact-checkers verify submissions

---

## Content Strategy

### Tone & Voice
- **Empathetic** - Acknowledge stress and uncertainty
- **Actionable** - Clear next steps, no jargon
- **Non-judgmental** - Stigma-free language
- **Empowering** - "You deserve support" messaging
- **Factual** - Data-driven, cited sources

### Key Messages
1. "You are not alone - 150,000+ KC metro residents rely on SNAP"
2. "Help is available - find resources near you in seconds"
3. "Your privacy matters - no login, no tracking, no judgment"
4. "Data-driven solutions - explore the full picture of food security"

---

## Legal & Privacy

### Privacy Policy (Required)
- No personal data collection
- Cloudflare Analytics only (aggregated, anonymous)
- No cookies (except functional)
- No third-party tracking
- ZIP code searches not logged with IPs

### Terms of Use
- Information provided "as-is"
- Not a substitute for official agency guidance
- Resource verification efforts disclosed
- User-generated content moderation policy

### Accessibility Statement
- WCAG compliance commitment
- Contact for accessibility issues
- Alternative formats available on request

---

## Partnership Opportunities

### Potential Collaborators
1. **United Way 211 KC** - Data sharing, cross-promotion
2. **Harvesters** - Real-time pantry data feed
3. **MARC** - Regional data updates, policy context
4. **KCMO/WyCo Health Depts** - Official resource verification
5. **Local universities** - Student volunteers, research collaboration

### Outreach Strategy
- Introduce project via email to key contacts
- Offer value-add: "increase your reach, reduce your call volume"
- Request data access/APIs
- Propose co-branding opportunities
- Offer to white-label tool for agency use

---

## Risk Mitigation

### Data Quality Risks
- **Outdated info** → Automated checks, community flagging, clear "last updated" stamps
- **Inaccurate data** → Multi-source verification, cite primary sources only
- **Broken links** → Weekly link checker, fallback contact methods

### Operational Risks
- **Server downtime** → Cloudflare's 99.99% uptime SLA, static site resilience
- **Traffic spikes** → Cloudflare CDN scales automatically
- **Database costs** → Monitor D1 usage, optimize queries, cache heavily

### Reputational Risks
- **Misinformation** → Rigorous source vetting, corrections page
- **Political perception** → Strictly non-partisan, fact-based only
- **Privacy breach** → No personal data collected = no breach risk

---

## Future Enhancements (Roadmap)

### Version 2.0
- SMS text alerts for crisis updates (Twilio integration)
- Voice assistant integration (Alexa/Google skills)
- Printable wallet cards (PDF generator)
- Multi-city expansion (St. Louis, Wichita, etc.)

### Version 3.0
- AI chatbot for resource navigation (Anthropic/OpenAI)
- Predictive analytics (food insecurity forecasting)
- Agency impact dashboard (referral tracking)
- Mobile native apps (iOS/Android)

---

## Project Timeline (Tentative)

| Phase | Duration | Deliverable |
|---|---|---|
| **Planning** | Week 1-2 | This document, data audit complete |
| **Infrastructure** | Week 3-4 | Cloudflare setup, database schema, initial data import |
| **MVP Development** | Week 5-8 | Basic website: resource finder, crisis page, about |
| **Data Integration** | Week 9-10 | Automated data pipelines, Census API, state reports |
| **Testing & QA** | Week 11-12 | Accessibility audit, mobile testing, load testing |
| **Soft Launch** | Week 13 | Beta release, feedback collection |
| **Public Launch** | Week 14+ | Marketing, partnerships, ongoing iteration |

---

## Questions for Further Research

### Technical
- [ ] Does Census API provide tract-level SNAP data for KC metro?
- [ ] Can we partner with United Way 211 for real-time resource API?
- [ ] What are Cloudflare D1 storage limits on free tier?
- [ ] Best approach for PDF scraping (MO/KS state reports)?

### Content
- [ ] What are top 10 most-searched ZIP codes during past crises?
- [ ] Which resource types see highest demand (food vs. utility vs. housing)?
- [ ] What demographics are most underserved by current resources?
- [ ] What languages should we prioritize after English/Spanish?

### Policy
- [ ] Are there legal restrictions on republishing government data?
- [ ] Do agencies require permission to list their resources?
- [ ] What disclaimers are needed for eligibility calculators?
- [ ] Can we use "SNAP" and agency logos (trademark concerns)?

---

## Contact & Support

**Project Lead:** (TBD)
**Technical Lead:** (TBD)
**Data Lead:** (TBD)
**Community Liaison:** (TBD)

**GitHub Repository:** (Create when ready)
**Project Management:** (Notion/Trello/GitHub Projects)
**Communication:** (Slack/Discord/Email)

---

*Last Updated: November 4, 2025*
*Version: 1.0 - Initial Project Plan*
*Next Review: Weekly during planning phase*
