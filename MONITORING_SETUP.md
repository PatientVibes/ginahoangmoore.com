# Monitoring & Alerts Setup Guide

## Overview
Essential monitoring for ginahoangmoore.com to ensure uptime, performance, and error tracking.

---

## 1. Cloudflare Functions Monitoring (Built-in)

### Access Logs
**Dashboard:** https://dash.cloudflare.com → **Workers & Pages** → **ginahoangmoore-com** → **Logs**

**What to Monitor:**
- Function execution errors
- Database query failures
- API response times
- 4xx/5xx errors

### Real-time Logs (via CLI)
```bash
# Tail production logs
npx wrangler pages deployment tail

# Filter for errors only
npx wrangler pages deployment tail --status error
```

### Set Up Email Alerts (via Dashboard)
1. Go to **Account** → **Notifications**
2. Click **Add**
3. Select **Workers**
4. Choose:
   - ✅ Script Exceptions
   - ✅ Script Exceeded CPU Limit
   - ✅ Script Exceeded Memory
5. Add your email: chris.paul.moore@gmail.com
6. Save

---

## 2. Uptime Monitoring

### Option A: UptimeRobot (Free, Recommended)

**Setup:**
1. Visit https://uptimerobot.com
2. Sign up (free plan: 50 monitors, 5-minute checks)
3. Add HTTP(s) monitors:

```
Monitor 1: Homepage
URL: https://ginahoangmoore.com
Type: HTTP(s)
Interval: 5 minutes
Alert: Email

Monitor 2: API - Food Resources
URL: https://ginahoangmoore.com/api/resources?category=food
Type: HTTP(s) + Keyword
Keyword: "success":true
Interval: 5 minutes
Alert: Email

Monitor 3: API - Housing Resources
URL: https://ginahoangmoore.com/api/resources?category=housing
Type: HTTP(s) + Keyword
Keyword: "success":true
Interval: 5 minutes
Alert: Email
```

4. Set alert contacts:
   - Email: chris.paul.moore@gmail.com
   - Optional: SMS (paid feature)

**Benefits:**
- Free tier sufficient
- Email/SMS alerts
- Public status page option
- 99% uptime requirement tracking

---

### Option B: Cloudflare Health Checks (Paid Feature)

**If you have Pro plan:**
1. Go to **Traffic** → **Health Checks**
2. Create health checks for each endpoint
3. Set notification thresholds

**Cost:** $5/month per health check (Cloudflare Pro required)

---

### Option C: Simple Cron Monitoring (DIY)

**Create GitHub Actions workflow:**

```yaml
# .github/workflows/uptime-check.yml
name: Uptime Check
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Homepage
        run: |
          STATUS=$(curl -s -o /dev/null -w '%{http_code}' https://ginahoangmoore.com)
          if [ $STATUS -ne 200 ]; then
            echo "Homepage down! Status: $STATUS"
            exit 1
          fi

      - name: Check API
        run: |
          RESPONSE=$(curl -s https://ginahoangmoore.com/api/resources?category=food)
          if ! echo "$RESPONSE" | grep -q '"success":true'; then
            echo "API failing!"
            exit 1
          fi
```

Add email notifications via GitHub Actions (requires secrets setup).

---

## 3. Error Tracking

### Cloudflare Logpush (Paid Feature)
**If you have Pro plan:**
1. Set up Logpush to send logs to:
   - AWS S3
   - Google Cloud Storage
   - Splunk
   - Datadog

2. Configure alerts based on error patterns

---

### Sentry Integration (Optional)
**For detailed error tracking:**

1. Sign up: https://sentry.io (free tier: 5K errors/month)
2. Create project: **ginahoangmoore-com**
3. Add to Functions:

```typescript
// functions/_middleware.ts
import * as Sentry from "@sentry/cloudflare";

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 0.1,
});

export const onRequest: PagesFunction = async (context) => {
  try {
    return await context.next();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
```

**Benefits:**
- Detailed error stack traces
- User impact metrics
- Performance monitoring
- Release tracking

---

## 4. Performance Monitoring

### Web Vitals via Cloudflare Web Analytics

**Already configured!** Check:
- Dashboard: https://dash.cloudflare.com → **Analytics** → **Web Analytics**

**Metrics tracked:**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Page views
- Unique visitors

**Set thresholds:**
- LCP: < 2.5s (good)
- FID: < 100ms (good)
- CLS: < 0.1 (good)

---

### Lighthouse CI (Already Set Up)

**Check `.github/workflows/lighthouse.yml`**

Runs on every PR/push to main:
- Performance score
- Accessibility score
- Best practices
- SEO score

**View results:**
- GitHub Actions tab
- Set score thresholds if needed

---

## 5. Database Monitoring

### D1 Metrics (via Dashboard)
**Access:** https://dash.cloudflare.com → **D1** → **kc-food-security**

**Monitor:**
- Query count
- Storage size
- Read/write operations

**Alerts to set up:**
- Storage > 80% capacity
- Query errors > threshold

---

### Custom Health Check Query

Add to monitoring:
```bash
# Check database has data
curl https://ginahoangmoore.com/api/resources?category=food | jq '.count'
# Should return: number > 0
```

---

## 6. Recommended Alert Configuration

### Critical (Immediate Action)
- ⛔ **Site down** (5xx errors)
- ⛔ **API failing** (returns errors)
- ⛔ **Database unavailable**
- ⛔ **Function exceptions**

**Alert via:** Email + SMS

---

### Warning (Check Soon)
- ⚠️ **Response time > 3s**
- ⚠️ **4xx error rate > 5%**
- ⚠️ **Memory usage > 80%**

**Alert via:** Email

---

### Info (Daily Digest)
- ℹ️ **Daily traffic summary**
- ℹ️ **Top pages visited**
- ℹ️ **API usage stats**

**Alert via:** Email (daily)

---

## 7. Status Page (Optional)

### Create Public Status Page

**Option A:** UptimeRobot Public Page (Free)
- Automatically generated from monitors
- Custom domain support
- Example: status.ginahoangmoore.com

**Option B:** Custom Status Page
- Add `/status` page to site
- Show uptime metrics
- API health indicators

---

## 8. Monitoring Checklist

### Initial Setup (Do Now)
- [ ] Enable Cloudflare email notifications for Functions
- [ ] Set up UptimeRobot monitors (3-5 monitors)
- [ ] Test alert delivery (trigger test alert)
- [ ] Add monitoring docs to project

### Weekly Checks
- [ ] Review Cloudflare Functions logs
- [ ] Check uptime percentages
- [ ] Verify API response times
- [ ] Check for any error patterns

### Monthly Reviews
- [ ] Analyze traffic trends
- [ ] Review performance metrics
- [ ] Update alert thresholds if needed
- [ ] Document any incidents

---

## 9. Quick Command Reference

```bash
# Real-time logs
npx wrangler pages deployment tail

# Check site status
curl -I https://ginahoangmoore.com

# Test API
curl https://ginahoangmoore.com/api/resources?category=food | jq '.success'

# Check database count
npx wrangler d1 execute kc-food-security --command="SELECT COUNT(*) FROM resources"

# View recent deployments
npx wrangler pages deployment list

# View function metrics
# (via Dashboard only - no CLI command)
```

---

## 10. Incident Response

### If Site is Down:
1. Check Cloudflare status: https://www.cloudflarestatus.com
2. Check GitHub Actions (deployment failures)
3. Review Functions logs for errors
4. Check D1 database status

### If API Failing:
1. Check Functions logs
2. Verify D1 binding configuration
3. Test database query directly
4. Check for recent code changes

### If Slow Performance:
1. Check Cloudflare cache hit rate
2. Review Database query performance
3. Check for API rate limiting
4. Analyze Web Vitals data

---

## Next Steps

1. ✅ Review this guide
2. ⏳ **Set up UptimeRobot** (highest priority - 15 minutes)
3. ⏳ **Enable Cloudflare email alerts** (5 minutes)
4. ⏳ Test alert delivery
5. ⏳ Document baseline metrics

---

*Created: November 4, 2025*
*Update frequency: Monthly or after incidents*
