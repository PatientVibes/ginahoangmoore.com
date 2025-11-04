# Census API Key - Current Status

## Issue: Federal Funding Lapse

As of November 4, 2025, the Census Bureau website displays:

> "Due to the lapse of federal funding, portions of this website are not being updated. Any inquiries submitted via www.census.gov will not be answered until appropriations are enacted."

This affects the API key registration process.

---

## Census API Key Registration (When Available)

**Normal Registration URL**: https://api.census.gov/data/key_signup.html

### Registration Process (when service resumes):
1. Visit the key signup page
2. Fill out the form:
   - **Organization**: Personal project or organization name
   - **Email**: Your email address
3. Submit the form
4. Check email for API key
5. Activate key by clicking link in email

---

## Alternative Approaches

### Option 1: Use Census API Without Key (Limited)

The Census API **does work without a key** but with lower rate limits:

```bash
# Test API access (no key required for basic queries)
curl "https://api.census.gov/data/2022/acs/acs5/subject?get=NAME,S2201_C01_001E&for=county:095&in=state:29"
```

**Limitations without key:**
- Lower rate limits (500 queries/day vs. unlimited with key)
- May be throttled during high traffic

**Our usage:**
- Weekly automated sync = ~5 API calls/week
- Manual testing = ~10-20 calls/week
- **Total: ~25 calls/week** (well under 500/day limit)

**Recommendation:** We can proceed without a key initially since our usage is very low.

---

### Option 2: Wait for Government Funding Resolution

Monitor https://api.census.gov/data/key_signup.html for service restoration.

Once available:
1. Register for API key
2. Configure in Cloudflare Pages:
   ```bash
   wrangler pages secret put CENSUS_API_KEY --project-name=ginahoangmoore
   ```
3. Redeploy if needed (environment variable change may require redeploy)

---

### Option 3: Test Census API Now (No Key Required)

We can test the Census sync endpoint **without a key** since our usage is low:

```bash
# Test Census API directly (no key)
curl "https://api.census.gov/data/2022/acs/acs5/subject?get=NAME,S2201_C01_001E,S2201_C04_001E,S1901_C01_012E,S1701_C03_001E&for=county:095&in=state:29"
```

**If this works**, we can:
1. Deploy the census-sync function **without** setting CENSUS_API_KEY
2. Modify code to make key optional
3. Add key later when services resume

---

## Modified Deployment Strategy

### Step 1: Make Census API key optional in code

Update `functions/api/census-sync.ts` to allow operation without key:

```typescript
// Change this check:
if (!censusApiKey) {
    return new Response(JSON.stringify({
        success: false,
        error: 'Census API key not configured'
    }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
}

// To this (making key optional):
const apiUrl = censusApiKey
    ? `${baseUrl}&key=${censusApiKey}`
    : baseUrl;

console.log(censusApiKey
    ? 'Using Census API key'
    : 'Operating without API key (rate limited)');
```

### Step 2: Test Census API availability

```bash
# Test if Census API is responding (should work even during funding lapse)
curl "https://api.census.gov/data/2022/acs/acs5/subject?get=NAME&for=county:095&in=state:29"
```

### Step 3: Deploy and test

If Census API is still responding to queries (likely - APIs often stay operational even when website is down), we can:
1. Deploy current code
2. Test manually via `/api/census-sync`
3. Add API key later when registration reopens

---

## Database Consideration

Our D1 database `snap_participation` table is ready to receive Census data. We have two options:

### Option A: Wait for Census API access
- Pro: Official data directly from Census
- Con: Delayed feature deployment

### Option B: Use existing published data temporarily
- Download 2022 ACS 5-Year estimates manually from:
  - https://data.census.gov (if accessible)
  - Or use cached data from previous downloads
- Import manually into D1 database
- Replace with automated sync once Census API key is available

---

## Recommended Next Steps

### Immediate (Today)
1. **Test Census API** to see if queries work without key:
   ```bash
   curl "https://api.census.gov/data/2022/acs/acs5/subject?get=NAME,S2201_C01_001E&for=county:095&in=state:29"
   ```

2. **If API responds**: Modify code to make key optional, deploy, test
3. **If API fails**: Look for alternative data sources or wait for services to resume

### Short-term (This Week)
1. Monitor https://api.census.gov/data/key_signup.html for service restoration
2. Register for API key when available
3. Configure environment variable
4. Enable key in production

### Alternative Data Sources (If Census API unavailable)
- **Data.census.gov** - Download CSV files manually (if accessible)
- **MARC (Mid-America Regional Council)** - May have cached/republished Census data
- **State agencies** - Missouri DSS and Kansas DCF publish SNAP data (different source, still valuable)

---

## Current Status

**Census API Code**: ✅ Complete and committed
**API Key**: ❌ Registration unavailable due to federal funding lapse
**Workaround**: ✅ Can operate without key (lower rate limits)
**Recommendation**: Test API availability, proceed if queries work

---

*Updated: November 4, 2025*
*Status: Awaiting Census Bureau service restoration or successful no-key test*
