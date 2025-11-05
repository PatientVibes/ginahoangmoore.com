# Production Deployment Guide

## Current Status
- ✅ Local database populated with 14 resources
- ⏳ **Remote (production) database needs to be populated**
- ✅ API functions deployed and ready

---

## Push Database to Production

### Method 1: Cloudflare Dashboard (Recommended - Easiest)

1. **Go to Cloudflare Dashboard:**
   - Visit https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → **D1**

2. **Select your database:**
   - Click on `kc-food-security`

3. **Open Console:**
   - Click the **Console** tab

4. **Copy SQL commands:**
   - Open `database/seed-data-simple.sql`
   - Copy the entire contents

5. **Paste and Execute:**
   - Paste into the Console
   - Click **Execute**

6. **Verify:**
   - Run: `SELECT COUNT(*) FROM resources`
   - Should show: `14`

---

### Method 2: Command Line (Requires API Token)

**Setup (one-time):**
```bash
# Export your Cloudflare API token
export CLOUDFLARE_API_TOKEN="your-token-here"
```

**Push data:**
```bash
npx wrangler d1 execute kc-food-security --remote --file=database/seed-data-simple.sql
```

**Verify:**
```bash
npx wrangler d1 execute kc-food-security --remote --command="SELECT COUNT(*) FROM resources"
```

---

## Test Production API

Once database is populated, test the API endpoints:

```bash
# Test food resources
curl https://ginahoangmoore.com/api/resources?category=food

# Test housing resources
curl https://ginahoangmoore.com/api/resources?category=housing

# Test utilities
curl https://ginahoangmoore.com/api/resources?category=utilities

# Test mental health
curl https://ginahoangmoore.com/api/resources?category=mental-health
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Resource Name",
      "category_id": 1,
      "description": "...",
      "phone_formatted": "(XXX) XXX-XXXX",
      ...
    }
  ],
  "count": X
}
```

---

## Verify on Live Site

1. Visit category pages:
   - https://ginahoangmoore.com/resources/food
   - https://ginahoangmoore.com/resources/housing
   - https://ginahoangmoore.com/resources/utilities
   - https://ginahoangmoore.com/resources/mental-health

2. **Before database push:** Shows fallback content
3. **After database push:** Shows real resource cards (after clearing the 3-second timeout)

---

## Troubleshooting

### API Returns Empty Array
**Problem:** `{"success": true, "data": [], "count": 0}`
**Solution:** Database not populated. Follow steps above.

### API Returns Error
**Problem:** `{"success": false, "error": "..."}`
**Possible causes:**
1. D1 binding not configured (check Cloudflare Dashboard > Settings > Functions > Bindings)
2. Database doesn't exist
3. Function deployment failed

**Check logs:**
```bash
# View recent function logs
npx wrangler pages deployment tail
```

### Resources Not Showing on Site
**Problem:** Page still shows "Coming Soon" fallback
**Possible causes:**
1. Database empty (most likely)
2. JavaScript timeout (3 seconds) - wait longer
3. Browser cache - hard refresh (Ctrl+Shift+R)

---

## Next Steps After Database Push

1. ✅ **Test all category pages** - Verify resources display
2. ⏳ **Add more resources** - Goal: 50+ verified resources
3. ⏳ **Set up monitoring** - Track API errors
4. ⏳ **Enable analytics** - Monitor usage

---

*Created: November 4, 2025*
