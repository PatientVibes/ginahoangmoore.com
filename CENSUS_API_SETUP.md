# Census API Setup Guide

## Overview

This guide explains how to set up automated data collection from the U.S. Census Bureau's American Community Survey (ACS) API for SNAP participation and demographic data in the Kansas City metro area.

---

## 1. Obtain Census API Key

### Step 1: Register for a free Census API key

1. Visit: https://api.census.gov/data/key_signup.html
2. Fill out the form with your information:
   - **Organization**: Personal project or organization name
   - **Email**: Your email address (you'll receive the key here)
3. Submit the form
4. **Check your email** for the API key (usually arrives within a few minutes)
5. **Activate the key** by clicking the link in the email

### Step 2: Test your API key

```bash
# Replace YOUR_KEY_HERE with your actual API key
curl "https://api.census.gov/data/2022/acs/acs5/subject?get=NAME,S2201_C01_001E&for=county:095&in=state:29&key=YOUR_KEY_HERE"
```

Expected response:
```json
[
  ["NAME","S2201_C01_001E","state","county"],
  ["Jackson County, Missouri","297503","29","095"]
]
```

---

## 2. Configure Cloudflare Pages Environment Variables

### Option A: Using Wrangler CLI (recommended)

```bash
# Navigate to project directory
cd /home/ubuntu/ginahoangmoore.com

# Set Census API key as secret (will prompt for value)
wrangler pages secret put CENSUS_API_KEY --project-name=ginahoangmoore

# Enter your Census API key when prompted
```

### Option B: Using Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com
2. Select **Pages** from the sidebar
3. Click on **ginahoangmoore** project
4. Go to **Settings** → **Environment variables**
5. Click **Add variable**
6. Name: `CENSUS_API_KEY`
7. Value: Your Census API key
8. Environment: **Production** (and optionally Preview)
9. Click **Save**

---

## 3. Deploy the Census Sync Function

### Step 1: Commit and push changes

```bash
cd /home/ubuntu/ginahoangmoore.com

# Add new files
git add functions/api/census-sync.ts
git add wrangler.toml
git add CENSUS_API_SETUP.md

# Commit
git commit -m "Add Census API automated data collection

- Fetch SNAP participation data for KC metro counties
- Weekly automated sync via Cron Trigger
- Store in D1 snap_participation table"

# Push to GitHub (triggers automatic Cloudflare Pages deployment)
git push origin main
```

### Step 2: Verify deployment

1. Wait for Cloudflare Pages to deploy (usually 1-2 minutes)
2. Check deployment status in Cloudflare dashboard or via CLI:

```bash
wrangler pages deployment list --project-name=ginahoangmoore
```

---

## 4. Test the Census Sync Function

### Manual test via HTTP

```bash
# Test the endpoint (should trigger data sync)
curl https://ginahoangmoore.com/api/census-sync

# Expected response:
{
  "success": true,
  "message": "Census data synced successfully",
  "counties_updated": 5,
  "data": [
    {
      "county": "Jackson",
      "state": "MO",
      "snap_households": 45123,
      "total_households": 297503,
      "snap_rate": 15.17,
      ...
    },
    ...
  ]
}
```

### Verify data in database

```bash
# Check snap_participation table
wrangler d1 execute kc-food-security --remote --command \
  "SELECT county, state, snap_rate, updated_at FROM snap_participation ORDER BY county"
```

Expected output:
```
┌──────────┬───────┬───────────┬─────────────────────┐
│ county   │ state │ snap_rate │ updated_at          │
├──────────┼───────┼───────────┼─────────────────────┤
│ Clay     │ MO    │ 12.45     │ 2025-11-04 18:30:00 │
│ Jackson  │ MO    │ 15.17     │ 2025-11-04 18:30:00 │
│ Johnson  │ KS    │ 6.82      │ 2025-11-04 18:30:00 │
│ Platte   │ MO    │ 9.34      │ 2025-11-04 18:30:00 │
│ Wyandotte│ KS    │ 18.92     │ 2025-11-04 18:30:00 │
└──────────┴───────┴───────────┴─────────────────────┘
```

---

## 5. Cron Schedule (Automated Updates)

The Census sync function is scheduled to run automatically:

- **Frequency**: Weekly
- **Day**: Sunday
- **Time**: 3:00 AM Central Time (9:00 AM UTC)
- **Cron expression**: `0 9 * * 0`

### Why weekly?

- Census data updates annually (ACS 5-Year estimates)
- Weekly sync ensures data freshness without excessive API calls
- Stays within Census API rate limits (no daily limit, but fair use policy)

### Monitor scheduled runs

```bash
# View Cron Trigger logs
wrangler pages deployment tail --project-name=ginahoangmoore
```

Or via Cloudflare Dashboard:
1. Pages → ginahoangmoore → **Functions**
2. Select `census-sync` function
3. View **Invocations** and **Logs**

---

## 6. Data Schema

Data is stored in the `snap_participation` table:

```sql
CREATE TABLE snap_participation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    county TEXT NOT NULL,
    state TEXT NOT NULL,
    year INTEGER NOT NULL,
    households_receiving_snap INTEGER,
    total_households INTEGER,
    snap_rate REAL,
    median_household_income INTEGER,
    poverty_rate REAL,
    data_source TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(county, state, year)
);
```

---

## 7. Census API Resources

### API Documentation
- **Main docs**: https://www.census.gov/data/developers/data-sets.html
- **ACS Subject Tables**: https://api.census.gov/data/2022/acs/acs5/subject.html
- **Variable list**: https://api.census.gov/data/2022/acs/acs5/subject/variables.html

### Key Variables Used

| Variable | Description |
|---|---|
| `S2201_C01_001E` | Total households |
| `S2201_C04_001E` | Households receiving SNAP/Food Stamps |
| `S1901_C01_012E` | Median household income (past 12 months) |
| `S1701_C03_001E` | Percent below poverty level |

### KC Metro Counties (FIPS Codes)

| County | State | State FIPS | County FIPS | Full FIPS |
|---|---|---|---|---|
| Jackson | MO | 29 | 095 | 29095 |
| Clay | MO | 29 | 047 | 29047 |
| Platte | MO | 29 | 165 | 29165 |
| Johnson | KS | 20 | 091 | 20091 |
| Wyandotte | KS | 20 | 209 | 20209 |

---

## 8. Troubleshooting

### Error: "Census API key not configured"

**Solution**: Ensure you've set the `CENSUS_API_KEY` environment variable in Cloudflare Pages settings.

```bash
# Verify secret is set
wrangler pages secret list --project-name=ginahoangmoore
```

### Error: "No Census data retrieved"

**Possible causes**:
1. Invalid API key → Verify key is active
2. API rate limit exceeded → Wait 1 hour and retry
3. API endpoint changed → Check Census API documentation for updates

**Debug**:
```bash
# Test API manually
curl "https://api.census.gov/data/2022/acs/acs5/subject?get=NAME&for=county:*&in=state:29&key=YOUR_KEY"
```

### Error: Database constraint violation

**Cause**: Duplicate county/state/year entry (UNIQUE constraint)

**Solution**: This is normal - the `ON CONFLICT` clause updates existing records. If you see errors, check database schema:

```bash
wrangler d1 execute kc-food-security --remote --command \
  "PRAGMA table_info(snap_participation)"
```

---

## 9. Next Steps

After Census API setup is complete:

1. ✅ Census API automated collection (this guide)
2. 🔜 Missouri DSS SNAP report scraping (monthly)
3. 🔜 Kansas DCF SNAP report scraping (monthly)
4. 🔜 Feeding America "Map the Meal Gap" integration (annual)
5. 🔜 Create data dashboard to display SNAP trends

---

## 10. API Rate Limits & Best Practices

### Census API Limits
- **No hard daily limit** for basic queries
- **Fair use policy**: Avoid excessive requests (>100/hour)
- **Recommendation**: Cache results, schedule reasonable intervals

### Our approach
- ✅ Weekly automated sync (not daily)
- ✅ Cache data in D1 database
- ✅ Serve cached data to users (no direct Census API calls from frontend)
- ✅ HTTP endpoint for manual refresh if needed

---

*Last Updated: November 4, 2025*
*Status: Ready for deployment*
