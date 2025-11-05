# GinaHoangMoore.com - AI-Optimized Project Documentation

**Last Updated:** November 5, 2025
**Status:** ✅ Production (Live)
**URL:** https://ginahoangmoore.com

---

## Quick Reference (For AI Assistants)

### Current Project State
- **Status:** Live in production since November 2025
- **Database:** 97 verified resources in Cloudflare D1
- **Features:** ZIP search (functional), Spanish translation (homepage), 14 pages
- **Monitoring:** UptimeRobot (5 monitors), Cloudflare Web Analytics
- **Recent Fix:** Category page JavaScript error resolved (services_provided string/array handling)

### Critical Commands
```bash
# Database operations (requires CLOUDFLARE_API_TOKEN from /home/ubuntu/.env)
CLOUDFLARE_API_TOKEN=xxx npx wrangler d1 execute kc-food-security --remote --file=/path/to/file.sql

# Deploy changes
git add -A && git commit -m "message" && git push  # Auto-deploys to Cloudflare Pages

# Test locally
npx wrangler pages dev public

# View live logs
npx wrangler pages deployment tail --project-name=ginahoangmoore-com
```

### Project Files
- **Working Directory:** `/home/ubuntu/ginahoangmoore.com/`
- **Frontend:** `/home/ubuntu/ginahoangmoore.com/public/` (static HTML/CSS/JS)
- **API:** `/home/ubuntu/ginahoangmoore.com/functions/api/resources.ts` (Cloudflare Function)
- **Database:** Cloudflare D1 `kc-food-security` (ID: 542916a2-a743-4932-8d73-643d02bf5110)
- **Environment:** `/home/ubuntu/.env` (CLOUDFLARE_API_TOKEN, zone IDs)

---

## Project Overview

### Mission
Provide accessible, data-driven food security resources and SNAP benefit information for Kansas City metro residents, particularly during crisis periods.

### Target Audience
1. **Primary:** KC metro residents needing food/utility/housing assistance
2. **Secondary:** Social workers, advocates, researchers
3. **Tertiary:** Policy makers, community organizations

### Coverage Area
- **Missouri Counties:** Jackson, Clay, Platte
- **Kansas Counties:** Johnson, Wyandotte
- **Total:** 5-county Kansas City metropolitan area

---

## Technical Stack

### Infrastructure
| Component | Technology | Details |
|-----------|------------|---------|
| **Hosting** | Cloudflare Pages | Automatic deployments from GitHub main branch |
| **Database** | Cloudflare D1 | SQLite, 0.22 MB, 97 resources |
| **API** | Cloudflare Functions | Serverless TypeScript at `/api/resources` |
| **DNS** | Cloudflare | Zone ID: `d145a1a0944a9f9e391155098e9abc75` |
| **Analytics** | Cloudflare Web Analytics | Token: `ef5b341a90de40ae9bfff903ffb7d1b5` |
| **Monitoring** | UptimeRobot | 5 monitors, 5-minute intervals |
| **Version Control** | GitHub | PatientVibes/ginahoangmoore.com |

### Frontend
- **Languages:** HTML5, CSS3, Vanilla JavaScript
- **CSS Architecture:** Design tokens (tokens.css) + components + utilities
- **Charts:** Chart.js 4.4.0 (for data visualizations)
- **Accessibility:** WCAG 2.1 AA compliant
- **Languages:** English (primary), Spanish (homepage only)

### Backend
- **Runtime:** Cloudflare Workers (V8 isolates)
- **Language:** TypeScript
- **Database Driver:** Cloudflare D1 binding
- **Caching:** 5-minute cache on API responses

---

## Database Schema

### Main Tables
```sql
-- Resources (97 total)
CREATE TABLE resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER,
    description TEXT,
    phone TEXT,
    phone_formatted TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    county TEXT,
    latitude REAL,
    longitude REAL,
    hours_of_operation TEXT,
    eligibility_criteria TEXT,
    restrictions TEXT,
    services_provided TEXT,  -- Comma-separated string OR JSON array
    verified INTEGER DEFAULT 0,
    data_source TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Categories (12 total)
CREATE TABLE resource_categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    parent_id INTEGER,
    icon TEXT,
    description TEXT
);

-- ZIP Codes (100 KC metro)
CREATE TABLE zipcodes (
    zip TEXT PRIMARY KEY,
    city TEXT,
    county TEXT,
    state TEXT,
    latitude REAL,
    longitude REAL
);
```

### Resource Categories
1. Food Assistance (slug: `food`) - ~35 resources
2. Housing (slug: `housing`) - ~10 resources
3. Mental Health (slug: `mental-health`) - ~17 resources
4. Healthcare (slug: `healthcare`) - ~10 resources
5. Utilities (slug: `utilities`) - ~10 resources
6. Financial Aid (slug: `financial`) - ~15 resources

---

## API Endpoints

### GET /api/resources
**Base URL:** `https://ginahoangmoore.com/api/resources`

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Filter by category slug | `?category=food` |
| `zip` | string | Filter by ZIP code with distance | `?zip=64106` |
| `radius` | number | Max distance in miles (default: 25) | `?zip=64106&radius=10` |

#### Response Format
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "id": 1,
      "name": "Harvesters - The Community Food Network",
      "category_id": 1,
      "category_name": "Food Assistance",
      "category_slug": "food",
      "category_icon": "🍎",
      "description": "Serving 26 counties...",
      "phone": "8776539519",
      "phone_formatted": "(877) 653-9519",
      "email": "info@harvesters.org",
      "website": "https://www.harvesters.org",
      "address": "3801 Topping Avenue",
      "city": "Kansas City",
      "state": "MO",
      "zip": "64129",
      "county": "Jackson",
      "latitude": 39.0997,
      "longitude": -94.5786,
      "hours_of_operation": "Monday-Friday: 8 AM - 4:30 PM",
      "services_provided": "Food pantries, Mobile distributions, SNAP outreach",
      "verified": 1,
      "distance_miles": 3.2  // Only present when ?zip= is used
    }
  ],
  "user_location": {  // Only present when ?zip= is used
    "zip": "64106",
    "latitude": 39.0997,
    "longitude": -94.5786,
    "city": "Kansas City",
    "county": "Jackson",
    "state": "MO"
  }
}
```

---

## Site Structure

### Pages (14 Total)
```
/ (Homepage)
  ├── English: /index.html
  └── Spanish: /es/index.html ✅

/resources (Hub page)
  ├── /resources/index.html
  ├── /resources/search ✅ (ZIP search results)
  ├── /resources/food
  ├── /resources/housing
  ├── /resources/utilities
  ├── /resources/mental-health
  ├── /resources/healthcare
  └── /resources/financial

/data (Data dashboard)
/crisis (Emergency info)
/faq (Frequently asked questions)
/get-involved (Volunteer/donate)
/about (About the platform)
/privacy (Privacy policy)
/eligibility (SNAP calculator - placeholder)
```

### Static Files
- `/sitemap.xml` - 13 URLs for SEO
- `/robots.txt` - Search engine instructions
- `/BingSiteAuth.xml` - Bing verification
- `/css/` - Stylesheets
- `/js/` - JavaScript modules
- `/data/` - JSON data files (food security stats)

---

## Key Features

### ✅ Implemented
1. **ZIP Code Search** - Users enter ZIP, get resources sorted by distance
2. **Category Filtering** - Browse by food, housing, utilities, mental health, etc.
3. **Distance Calculation** - Haversine formula calculates miles from user location
4. **Spanish Translation** - Homepage available in Spanish (`/es/`)
5. **Mobile-Responsive** - Works on all devices
6. **Crisis Alerts** - Banner for emergency updates (SNAP delays, etc.)
7. **Data Dashboard** - Interactive Chart.js visualizations with KC metro food security data
8. **SEO Optimization** - Structured data, meta tags, sitemap
9. **Monitoring** - UptimeRobot with email alerts
10. **Analytics** - Cloudflare Web Analytics (privacy-friendly)

### 🚧 In Progress / Planned
1. **Category Page Resource Loading** - Some category pages show fallback content (housing, utilities, etc.)
2. **Spanish Translation** - Expand to all pages (currently homepage only)
3. **Interactive Data Charts** - Add more visualizations to /data page
4. **Resource Submission Form** - Let providers update their own info
5. **Mobile PWA** - Offline capability, push notifications

---

## Data Sources

### Primary Sources (Federal)
- **USDA FNS** - National SNAP data
- **U.S. Census Bureau ACS** - County-level demographics

### State Sources
- **Missouri DSS** - MO SNAP caseloads (Jackson, Clay, Platte counties)
- **Kansas DCF** - KS SNAP data (Johnson, Wyandotte counties)

### Local Sources
- **Feeding America** - Food insecurity rates (Map the Meal Gap)
- **Harvesters** - KC food bank distribution data
- **MARC** - Mid-America Regional Council indicators
- **United Way 211** - Resource referral data (potential partnership)

### Current Data Files
- `/public/data/kc-food-security-data.json` - Manually curated data from above sources
- Database seed files in `/database/` directory

---

## Common Tasks (For AI Assistants)

### Adding New Resources to Database
```bash
# 1. Create SQL file (e.g., /tmp/new-resource.sql)
cat > /tmp/new-resource.sql << 'EOF'
INSERT INTO resources (
    name, category_id, description, phone, phone_formatted,
    email, website, address, city, state, zip,
    services_provided, verified, data_source
) VALUES (
    'Organization Name',
    1,  -- Category: 1=Food, 3=Housing, 4=Mental Health, 5=Healthcare, 11=Utilities, 6=WIC
    'Description here',
    '8165551234',
    '(816) 555-1234',
    'contact@example.org',
    'https://example.org',
    '123 Main St',
    'Kansas City',
    'MO',
    '64106',
    'Service 1, Service 2, Service 3',
    1,  -- 1 = verified
    'Data Source Name'
);
EOF

# 2. Load into production database
CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_API_TOKEN /home/ubuntu/.env | cut -d= -f2) npx wrangler d1 execute kc-food-security --remote --file=/tmp/new-resource.sql

# 3. Verify insertion
CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_API_TOKEN /home/ubuntu/.env | cut -d= -f2) npx wrangler d1 execute kc-food-security --remote --command="SELECT COUNT(*) as total FROM resources"
```

### Deploying Changes
```bash
# Standard git workflow - Cloudflare Pages auto-deploys from main branch
cd /home/ubuntu/ginahoangmoore.com
git add -A
git commit -m "Description of changes"
git push

# Cloudflare Pages will automatically:
# 1. Detect the push
# 2. Build the site
# 3. Deploy to production
# 4. Usually completes in 30-60 seconds
```

### Testing with Playwright
```bash
# Use the Task tool with general-purpose agent
# Playwright MCP integration available for browser automation
# Example tasks:
# - Navigate to homepage and test ZIP search
# - Verify category pages load resources
# - Check for JavaScript errors in console
# - Take screenshots of pages
```

### Checking Database Status
```bash
# Get resource count
CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_API_TOKEN /home/ubuntu/.env | cut -d= -f2) npx wrangler d1 execute kc-food-security --remote --command="SELECT COUNT(*) FROM resources"

# List recent resources
CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_API_TOKEN /home/ubuntu/.env | cut -d= -f2) npx wrangler d1 execute kc-food-security --remote --command="SELECT name, city, category_id FROM resources ORDER BY id DESC LIMIT 10"

# Get category breakdown
CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_API_TOKEN /home/ubuntu/.env | cut -d= -f2) npx wrangler d1 execute kc-food-security --remote --command="SELECT category_id, COUNT(*) as count FROM resources GROUP BY category_id"
```

---

## Recent Changes (November 2025)

### November 5, 2025
1. **Fixed Category Page Error** - services_provided now handles both string and array formats
2. **Added Resources** - Pete's Garden and Kanbe's Markets (total: 97 resources)
3. **Comprehensive Testing** - Playwright tests confirmed ZIP search working, food category page loading
4. **Documentation Cleanup** - Streamlined and AI-optimized this file

### November 4-5, 2025 (Major Launch)
1. **ZIP Code Search** - Fully functional with distance calculation
2. **Spanish Homepage** - Complete translation of homepage
3. **Database Expansion** - 95 → 97 resources
4. **SEO Optimization** - Sitemap, structured data, meta tags
5. **Monitoring Setup** - UptimeRobot with 5 monitors
6. **Analytics** - Cloudflare Web Analytics on all pages

---

## Known Issues & Technical Debt

### Minor Issues
1. **Housing Category Page** - JavaScript null reference error (doesn't impact UX, shows fallback content)
2. **Hours Display** - Some resources show "[object Object]" for hours (needs formatting fix)
3. **Category Pages** - Only food category loads from API, others show static fallback

### Future Enhancements
1. **Complete Spanish Translation** - Translate all pages beyond homepage
2. **Interactive Maps** - Mapbox/Leaflet integration for visual resource location
3. **Resource Submission Form** - Let providers update their own information
4. **Admin Dashboard** - Web-based resource management (currently CLI-only)
5. **Mobile PWA** - Offline capability, add to home screen
6. **SMS Alerts** - Twilio integration for crisis notifications

---

## Important Notes for AI Assistants

### When Working with Database
- **Always use the token from `/home/ubuntu/.env`** - Don't hardcode tokens
- **Test queries locally first** if possible using `--local` flag
- **Verify insertions** - Always check count after adding resources
- **Use parameterized queries** - Prevent SQL injection (though D1 CLI is safe)

### When Editing Files
- **Read before editing** - Always use Read tool first
- **Preserve formatting** - Match existing indentation and style
- **Test locally** - Use `npx serve public` or `wrangler pages dev public` when possible
- **Deploy carefully** - Commits to main branch auto-deploy to production

### When Testing
- **Use Playwright for comprehensive tests** - Browser automation catches visual/JS errors
- **Check console for errors** - JavaScript errors may not be visible to users
- **Test mobile responsiveness** - Most users are on mobile devices
- **Verify all links** - Use monitoring tools to catch broken links

### When Adding Resources
- **Verify information** - Check websites, phone numbers before adding
- **Use consistent formatting** - Follow existing patterns for phone numbers, addresses
- **Include all fields** - Name, category, description, contact info, services
- **Mark as verified** - Set `verified = 1` for manually verified resources
- **Document source** - Always include `data_source` field

---

## Success Metrics

### Current Status (As of Nov 5, 2025)
- **Resources:** 97 verified organizations
- **Pages:** 14 (13 English + 1 Spanish)
- **Uptime:** 100% (monitored by UptimeRobot)
- **Performance:** API responses <200ms
- **SEO:** Sitemap submitted to Google and Bing

### Goals
| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Unique Visitors | 100-500 | 1,000-5,000 | 10,000+ |
| Resources | 100-150 | 200-250 | 300+ |
| Search Ranking | 30-50 | 10-20 | 5-10 |
| Return Visitors | 10% | 20% | 30% |

---

## Contact & Support

### Project Owner
- **Name:** Chris Moore
- **Email:** chris.paul.moore@gmail.com
- **GitHub:** [@PatientVibes](https://github.com/PatientVibes)

### Emergency Contacts (Featured on Site)
- **United Way 211:** Dial 211 (resource helpline)
- **988 Crisis Lifeline:** Call/Text 988 (mental health)
- **Harvesters:** (877) 653-9519 (food bank)

### Monitoring Alerts
- **UptimeRobot:** chris.paul.moore@gmail.com
- **Status Page:** https://status.ginahoangmoore.com (configured DNS, awaiting UptimeRobot config)

---

## Additional Documentation

### In Repository Root
- `README.md` - Project overview for GitHub
- `PROJECT_STATUS.md` - Detailed project status (needs update)
- `MONITORING_SETUP.md` - UptimeRobot configuration guide
- `SEO_OPTIMIZATION.md` - SEO implementation details
- `PRODUCTION_DEPLOYMENT.md` - Database deployment guide

### In /database Directory
- `README.md` - Database schema documentation
- `schema.sql` - Table definitions
- `seed-data-simple.sql` - Initial 14 resources
- `seed-data-expansion.sql` - Additional resources
- `zipcodes-kc-metro.sql` - KC metro ZIP codes with coordinates

### Archived Documentation (To Be Created)
- `/docs/archive/` - Old planning documents
- `/docs/archive/IMPLEMENTATION_ROADMAP.md`
- `/docs/archive/KC SNAP Benefit Assistance Planning.md`
- etc.

---

*This document is optimized for AI assistant comprehension and task execution.*
*For human-readable overview, see README.md*
*For detailed status, see PROJECT_STATUS.md*
