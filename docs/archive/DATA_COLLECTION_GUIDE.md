# Data Collection System - Complete Guide

## Overview

This guide documents all data collection systems for ginahoangmoore.com, including automated, semi-automated, and manual processes.

---

## Data Collection Summary

| Data Source | Automation Status | Frequency | API Endpoint |
|---|---|---|---|
| **U.S. Census Bureau ACS** | ✅ Fully Automated | Weekly | `/api/census-sync` |
| **Missouri DSS SNAP Reports** | ⚠️ Manual Entry | Monthly | `/api/state-snap-sync` |
| **Kansas DCF SNAP Reports** | ⚠️ Manual Entry | Monthly | `/api/state-snap-sync` |
| **Feeding America Map the Meal Gap** | ⚠️ Manual Entry | Annual | `/api/feeding-america-sync` |
| **Resource Database** | ✅ Manual Updates | Quarterly | `/api/resources` |

---

## 1. Census API - FULLY AUTOMATED ✅

### Status: Production-ready, operational

### Data Collected
- SNAP participation rates by county
- Total households and SNAP households
- Median household income
- Poverty rates

### Coverage
- Jackson County, MO
- Clay County, MO
- Platte County, MO
- Johnson County, KS
- Wyandotte County, KS

### Automation Details
- **Schedule**: Weekly on Sundays at 3 AM CT (9 AM UTC)
- **Cron**: `0 9 * * 0`
- **Endpoint**: `https://ginahoangmoore.com/api/census-sync`
- **Data API**: `https://ginahoangmoore.com/api/snap-data`

### Manual Testing

```bash
# Trigger manual sync
curl https://ginahoangmoore.com/api/census-sync

# View collected data
curl https://ginahoangmoore.com/api/snap-data

# View specific county
curl "https://ginahoangmoore.com/api/snap-data?county=Jackson&state=MO"
```

### Database Storage
- **Table**: `snap_participation`
- **Key fields**: `county`, `state`, `year`, `month` (0 for annual Census data)
- **Data fields**: `households_receiving_snap`, `total_households`, `snap_rate`, `median_household_income`, `poverty_rate`

### Notes
- API key optional (currently running without key, 500 queries/day limit)
- Our usage: ~5 queries/week (well under limit)
- Can add API key later via: `wrangler pages secret put CENSUS_API_KEY`

---

## 2. Missouri DSS SNAP Reports - MANUAL ENTRY ⚠️

### Status: Framework complete, requires PDF parsing or manual data entry

### Data Source
- **URL Pattern**: `https://dss.mo.gov/re/pdf/fsd_mhdmr/MMYY-family-support-mohealthnet-report.pdf`
  - Example: `https://dss.mo.gov/re/pdf/fsd_mhdmr/0825-family-support-mohealthnet-report.pdf` (August 2025)
- **SNAP Data Location**: Pages 20-21 of monthly report
- **Release Schedule**: Monthly (typically mid-month for prior month data)

### Data Elements
- County name
- Households receiving SNAP
- Persons (individuals) receiving SNAP
- Total benefits distributed (dollars)
- Average benefit per household
- Average benefit per person

### Manual Entry Process

#### Step 1: Download Report
```bash
# Download latest report (adjust MMYY as needed)
wget https://dss.mo.gov/re/pdf/fsd_mhdmr/0825-family-support-mohealthnet-report.pdf
```

#### Step 2: Extract Data for KC Metro Counties
Open PDF, navigate to pages 20-21, extract data for:
- Jackson County
- Clay County
- Platte County

#### Step 3: POST Data via API
```bash
curl -X POST https://ginahoangmoore.com/api/state-snap-sync \
  -H "Content-Type: application/json" \
  -d '[
    {
      "county": "Jackson",
      "state": "MO",
      "year": 2025,
      "month": 8,
      "households": 45123,
      "individuals": 87456,
      "total_benefits": 15234567,
      "avg_benefit_per_household": 337.85,
      "avg_benefit_per_person": 174.23
    },
    {
      "county": "Clay",
      "state": "MO",
      "year": 2025,
      "month": 8,
      "households": 12345,
      "individuals": 23456,
      "total_benefits": 4123456
    },
    {
      "county": "Platte",
      "state": "MO",
      "year": 2025,
      "month": 8,
      "households": 5678,
      "individuals": 10234,
      "total_benefits": 1823456
    }
  ]'
```

#### Step 4: Verify Data
```bash
# Check database
wrangler d1 execute kc-food-security --remote --command \
  "SELECT county, state, year, month, households, individuals FROM snap_participation WHERE state='MO' AND year=2025 ORDER BY county"
```

### Future Automation
To fully automate:
1. Implement PDF parsing (pdf-parse, pdfjs-dist libraries)
2. Or use external service (Adobe PDF Services API, AWS Textract)
3. Or request direct data API from Missouri DSS

---

## 3. Kansas DCF SNAP Reports - MANUAL ENTRY ⚠️

### Status: Framework complete, requires PDF/Excel parsing or manual data entry

### Data Source
- **URL**: https://www.dcf.ks.gov/services/ees/Pages/Reports.aspx
- **Format**: PDF or Excel (varies by report)
- **Release Schedule**: Monthly

### Data Elements
- County name
- Households receiving SNAP
- Persons receiving SNAP
- Total benefits distributed
- Average benefit amounts

### Manual Entry Process

Same as Missouri (Step 1-4 above), but for Kansas counties:
- Johnson County
- Wyandotte County

POST to same endpoint (`/api/state-snap-sync`) with `"state": "KS"`

---

## 4. Feeding America Map the Meal Gap - MANUAL ENTRY ⚠️

### Status: Framework complete, data available via request form

### Data Source
- **Interactive Map**: https://map.feedingamerica.org
- **Data Request Form**: https://feedingamerica.az1.qualtrics.com/jfe/form/SV_5tJt5m9K62hRC6N
- **Reports Page**: https://www.feedingamerica.org/research/map-the-meal-gap/by-county
- **Release Schedule**: Annual (released in May with prior year data)
- **Latest Report**: Map the Meal Gap 2025 (2023 data)

### Data Elements
- Overall food insecurity rate (%)
- Child food insecurity rate (%)
- Senior food insecurity rate (%)
- Cost per meal ($)
- Meal gap (total meals needed)
- Food insecure persons (total)
- Food insecure children (total)

### Data Collection Process

#### Step 1: Request Data
1. Visit: https://feedingamerica.az1.qualtrics.com/jfe/form/SV_5tJt5m9K62hRC6N
2. Fill out request form
3. Wait for email with data file (CSV or Excel)

#### Step 2: Extract KC Metro County Data
From the data file, extract records for:
- Jackson County, MO
- Clay County, MO
- Platte County, MO
- Johnson County, KS
- Wyandotte County, KS

#### Step 3: POST Data via API
```bash
curl -X POST https://ginahoangmoore.com/api/feeding-america-sync \
  -H "Content-Type: application/json" \
  -d '[
    {
      "county": "Jackson",
      "state": "MO",
      "year": 2023,
      "overall_rate": 14.2,
      "child_rate": 19.8,
      "senior_rate": 9.5,
      "cost_per_meal": 3.45,
      "meal_gap": 32500000,
      "food_insecure_persons": 95000,
      "food_insecure_children": 25000
    },
    {
      "county": "Clay",
      "state": "MO",
      "year": 2023,
      "overall_rate": 11.8,
      "child_rate": 16.2,
      "cost_per_meal": 3.32,
      "meal_gap": 8200000,
      "food_insecure_persons": 28000,
      "food_insecure_children": 7500
    }
  ]'
```

#### Step 4: Verify Data
```bash
# View via API
curl https://ginahoangmoore.com/api/food-insecurity

# Or check database directly
wrangler d1 execute kc-food-security --remote --command \
  "SELECT county, state, year, overall_rate, child_rate FROM food_insecurity ORDER BY state, county"
```

---

## 5. Resource Database - MANUAL UPDATES ✅

### Status: Operational, quarterly verification recommended

### Current Data
- **Total Resources**: 48
- **Categories**: 6 main (Food, Utilities, Housing, Mental Health, Financial, Healthcare)
- **Verification**: 100% verified against KC SNAP REVISED.md

### Quarterly Maintenance Tasks

#### Verify Resource Contact Information
```sql
-- Get all resources with phone numbers
wrangler d1 execute kc-food-security --remote --command \
  "SELECT id, name, phone_formatted, website FROM resources WHERE phone IS NOT NULL"

-- Get all resources with websites
wrangler d1 execute kc-food-security --remote --command \
  "SELECT id, name, website FROM resources WHERE website IS NOT NULL ORDER BY category_id"
```

#### Update Resource Information
1. Call phone numbers to verify still active
2. Check websites to confirm URL still works
3. Update hours of operation if changed
4. Update services provided if expanded/reduced

#### Add New Resources
```sql
-- Example INSERT for new resource
INSERT INTO resources (name, category_id, description, phone, website, city, state, services_provided, verified, verified_at, data_source)
VALUES ('New Resource Name', 1, 'Description here', '8165551234', 'https://example.org', 'Kansas City', 'MO', '["Service 1", "Service 2"]', 1, CURRENT_TIMESTAMP, 'Source name');
```

#### Remove Outdated Resources
```sql
-- Mark as unverified rather than deleting
UPDATE resources SET verified = 0, notes = 'Resource no longer available as of YYYY-MM-DD' WHERE id = ?;
```

---

## Data Quality Monitoring

### Automated Checks (Future Implementation)

```typescript
// Link checker (weekly)
// Check all resource URLs return 200 status
// Flag broken links for manual review

// Freshness monitoring
// Alert if data older than expected refresh cycle
// Census: > 7 days old
// State reports: > 45 days old
// Feeding America: > 18 months old
```

### Manual Quality Checks

**Monthly**:
- Review Census sync logs for errors
- Check latest data was collected successfully

**Quarterly**:
- Verify 10% sample of resource phone numbers
- Test resource website links
- Update resource hours/eligibility if changed

**Annually**:
- Full resource database verification
- Update all phone numbers
- Refresh all website URLs
- Request updated Feeding America data

---

## Database Schema Reference

### snap_participation Table
```sql
CREATE TABLE snap_participation (
    id INTEGER PRIMARY KEY,
    county TEXT NOT NULL,
    state TEXT NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,  -- 0 = annual Census, 1-12 = monthly state reports
    households INTEGER,
    individuals INTEGER,
    total_benefits_dollars INTEGER,
    average_benefit_per_household REAL,
    average_benefit_per_person REAL,
    households_receiving_snap INTEGER,  -- Census-specific
    total_households INTEGER,            -- Census-specific
    snap_rate REAL,                      -- Census-specific
    median_household_income INTEGER,     -- Census-specific
    poverty_rate REAL,                   -- Census-specific
    data_source TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(county, state, year, month)
);
```

### food_insecurity Table
```sql
CREATE TABLE food_insecurity (
    id INTEGER PRIMARY KEY,
    county TEXT NOT NULL,
    state TEXT NOT NULL,
    year INTEGER NOT NULL,
    overall_rate REAL,
    child_rate REAL,
    senior_rate REAL,
    cost_per_meal REAL,
    meal_gap INTEGER,
    food_insecure_persons INTEGER,
    food_insecure_children INTEGER,
    data_source TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(county, state, year)
);
```

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Status |
|---|---|---|---|
| `/api/census-sync` | GET | Trigger Census data sync | ✅ Live |
| `/api/snap-data` | GET | Retrieve SNAP statistics | ✅ Live |
| `/api/snap-data?county=Jackson&state=MO` | GET | County-specific SNAP data | ✅ Live |
| `/api/state-snap-sync` | POST | Manual state report entry | ✅ Live |
| `/api/state-snap-sync` | GET | State sync status/info | ✅ Live |
| `/api/feeding-america-sync` | POST | Manual food insecurity entry | ✅ Live |
| `/api/feeding-america-sync` | GET | Food insecurity status/info | ✅ Live |
| `/api/food-insecurity` | GET | Retrieve food insecurity data | ✅ Live |
| `/api/resources` | GET | Search/filter resources | ✅ Live |
| `/api/categories` | GET | List resource categories | ✅ Live |
| `/api/search` | GET | ZIP-based resource search | ✅ Live |
| `/api/crisis` | GET | Active crisis alerts | ✅ Live |

---

## Next Steps for Full Automation

### Priority 1: PDF Parsing for State Reports
**Technologies to evaluate**:
1. **pdf-parse** (Node.js library)
   - Pros: Simple, works in Workers environment
   - Cons: Text extraction only, no table parsing

2. **Tabula** (Python library)
   - Pros: Excellent table extraction
   - Cons: Requires Python runtime (use via external API)

3. **Adobe PDF Services API**
   - Pros: Commercial-grade, reliable
   - Cons: Costs money (~$0.05/page)

4. **AWS Textract**
   - Pros: Table extraction, OCR
   - Cons: Requires AWS account, costs vary

**Recommendation**: Start with pdf-parse for proof-of-concept, upgrade to Tabula or commercial service if needed.

### Priority 2: Feeding America Partnership
**Goal**: Request direct API access or bulk data sharing agreement

**Approach**:
1. Contact Feeding America research team
2. Explain project purpose (public good, food security)
3. Request:
   - Annual data file delivery via email
   - Or: Read-only API access for KC metro counties
   - Or: Bulk CSV download permission

### Priority 3: State Agency Data APIs
**Goal**: Request machine-readable data from Missouri DSS and Kansas DCF

**Approach**:
1. Submit FOIA/Open Records request for:
   - Monthly SNAP data in CSV/JSON format
   - Or: Read-only API access
2. Offer to help develop API if resources needed
3. Emphasize public benefit (transparency, easier data access for residents)

---

## Troubleshooting

### Census Sync Not Running
```bash
# Check Cron Trigger status in Cloudflare dashboard
# Or check logs:
wrangler pages deployment tail --project-name=ginahoangmoore

# Manual trigger test:
curl https://ginahoangmoore.com/api/census-sync
```

### State Report Data Entry Failing
```bash
# Verify JSON format:
cat data.json | jq .

# Test with single record first:
curl -X POST https://ginahoangmoore.com/api/state-snap-sync \
  -H "Content-Type: application/json" \
  -d '[{"county":"Jackson","state":"MO","year":2025,"month":8,"households":45123,"individuals":87456}]'
```

### Database Query Errors
```bash
# Check table schema:
wrangler d1 execute kc-food-security --remote --command "PRAGMA table_info(snap_participation)"

# Check data exists:
wrangler d1 execute kc-food-security --remote --command "SELECT COUNT(*) FROM snap_participation"
```

---

*Last Updated: November 4, 2025*
*Status: Census automation live, state reports manual entry ready*
