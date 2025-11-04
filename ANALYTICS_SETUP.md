# Analytics & Monitoring Setup Guide

## Cloudflare Web Analytics

### Step 1: Enable Cloudflare Web Analytics

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to your account → **Analytics** → **Web Analytics**
3. Click **Add a site**
4. Enter site name: `ginahoangmoore.com`
5. Click **Enable**
6. Copy the analytics script tag provided

### Step 2: Add Analytics Script

Add the Cloudflare Web Analytics beacon script to **every HTML file** before the closing `</body>` tag:

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "YOUR-TOKEN-HERE"}'></script>
</body>
```

**Files to update:**
- `public/index.html`
- `public/resources.html`
- `public/resources/food.html`
- `public/resources/housing.html`
- `public/resources/utilities.html`
- `public/resources/mental-health.html`
- `public/resources/financial.html`
- `public/resources/healthcare.html`
- `public/faq.html`
- Any other HTML pages

### Step 3: Configure Tracking

In Cloudflare Dashboard → Analytics → Web Analytics:

1. **Enable automatic event tracking:**
   - ✅ Page views
   - ✅ Link clicks
   - ✅ Form submissions
   - ✅ File downloads

2. **Set up custom events** (optional):
   - Track ZIP code searches
   - Track category selections
   - Track resource card clicks
   - Track phone number taps

### Step 4: Monitor Core Web Vitals

Cloudflare automatically tracks:
- **LCP** (Largest Contentful Paint) - Target: < 2.5s
- **FID** (First Input Delay) - Target: < 100ms
- **CLS** (Cumulative Layout Shift) - Target: < 0.1
- **INP** (Interaction to Next Paint) - Target: < 200ms

**Access reports:** Dashboard → Analytics → Web Analytics → Core Web Vitals

---

## Cloudflare Browser Insights (RUM)

### Enable Real User Monitoring

1. Go to **Speed** → **Optimization** → **Browser Insights**
2. Toggle **Enable Browser Insights** to ON
3. This provides:
   - Real user performance metrics
   - Geographic performance breakdown
   - Device/browser performance
   - JavaScript errors tracking

### Performance Budget Alerts

Set up alerts for performance degradation:

1. Go to **Notifications**
2. Create notification for **Web Analytics - Core Web Vitals degradation**
3. Set thresholds:
   - LCP > 2.5s
   - FID > 100ms
   - CLS > 0.1
4. Add email/webhook for alerts

---

## GitHub Pro Features Setup

### 1. Dependabot Configuration

#### Enable Dependabot

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ **Dependency graph**
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**

#### Create Dependabot Config

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    reviewers:
      - "PatientVibes"
    labels:
      - "dependencies"
      - "automated"

  # GitHub Actions updates
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "github-actions"
      - "automated"
```

### 2. GitHub Code Scanning (CodeQL)

#### Enable Code Scanning

1. Go to **Security** → **Code scanning**
2. Click **Set up code scanning**
3. Choose **CodeQL Analysis**
4. Select **Default** setup (recommended)
5. Click **Enable CodeQL**

This creates `.github/workflows/codeql.yml` automatically.

#### Custom CodeQL Config (Optional)

For more control, create `.github/codeql/codeql-config.yml`:

```yaml
name: "CodeQL Configuration"

# Scan these languages
languages:
  - javascript

# Custom queries
queries:
  - uses: security-and-quality

# Paths to exclude
paths-ignore:
  - 'node_modules/**'
  - 'public/js/vendor/**'
```

### 3. Secret Scanning

#### Enable Secret Scanning

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ **Secret scanning**
   - ✅ **Push protection** (prevents committing secrets)

Cloudflare automatically scans for:
- API keys
- Access tokens
- Database credentials
- Private keys

### 4. Branch Protection Rules

#### Protect Main Branch

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings**

5. Status checks (once workflows are created):
   - ✅ Lighthouse CI
   - ✅ Accessibility tests
   - ✅ Link checker

### 5. GitHub Actions Workflows

Create `.github/workflows/` directory with these workflows:

#### Lighthouse CI (`lighthouse.yml`)

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            https://ginahoangmoore.com
            https://ginahoangmoore.com/resources/food
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Check Performance Budget
        run: |
          # Fail if Performance score < 90
          # Fail if Accessibility score < 100
```

#### Accessibility Tests (`accessibility.yml`)

```yaml
name: Accessibility Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm install -g @axe-core/cli

      - name: Run axe-core
        run: |
          axe https://ginahoangmoore.com --exit
```

#### Link Checker (`link-checker.yml`)

```yaml
name: Link Checker

on:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday
  workflow_dispatch: # Manual trigger

jobs:
  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress 'public/**/*.html'
          fail: true
```

---

## Performance Monitoring Dashboard

### Access Metrics

**Cloudflare Dashboard:**
1. Analytics → Web Analytics → ginahoangmoore.com
2. View:
   - Page views
   - Unique visitors
   - Core Web Vitals
   - Top pages
   - Geographic distribution
   - Device/browser breakdown

**GitHub Insights:**
1. Go to **Insights** → **Traffic**
2. View:
   - Unique visitors (last 14 days)
   - Git clones
   - Popular content
   - Referring sites

---

## Custom Event Tracking (Advanced)

### Track ZIP Code Searches

Add to `/public/js/main.js`:

```javascript
// Track ZIP search
function trackZipSearch(zip) {
    if (typeof window.cfanalytics !== 'undefined') {
        cfanalytics.track('zip_search', { zip: zip });
    }
}
```

### Track Resource Clicks

```javascript
// Track resource card clicks
document.addEventListener('click', (e) => {
    const resourceCard = e.target.closest('.resource-item');
    if (resourceCard) {
        const category = resourceCard.dataset.category;
        const resourceName = resourceCard.querySelector('.resource-title')?.textContent;

        if (typeof window.cfanalytics !== 'undefined') {
            cfanalytics.track('resource_click', {
                category: category,
                resource: resourceName
            });
        }
    }
});
```

### Track Phone Number Taps

```javascript
// Track phone call attempts
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const phoneNumber = e.target.href.replace('tel:', '');

        if (typeof window.cfanalytics !== 'undefined') {
            cfanalytics.track('phone_call', { number: phoneNumber });
        }
    });
});
```

---

## Success Metrics to Track

### User Experience Metrics
- **Bounce rate** < 40%
- **Average session duration** > 2 minutes
- **Pages per session** > 2
- **Return visitor rate** > 15%

### Performance Metrics
- **Lighthouse Performance Score** > 90
- **Lighthouse Accessibility Score** = 100
- **LCP** < 2.5s
- **FID** < 100ms
- **CLS** < 0.1

### Engagement Metrics
- **ZIP searches** per session
- **Resource clicks** per session
- **Phone number clicks** (call-through rate)
- **Category page views**

---

## Weekly Monitoring Checklist

### Monday
- [ ] Review Cloudflare Web Analytics dashboard
- [ ] Check Core Web Vitals trends
- [ ] Review Dependabot PRs
- [ ] Check GitHub Actions workflow runs

### Wednesday
- [ ] Review user engagement metrics
- [ ] Check for accessibility issues
- [ ] Review error logs (if any)

### Friday
- [ ] Weekly performance report
- [ ] Identify slow pages
- [ ] Plan optimizations for next week

---

## Troubleshooting

### Analytics Not Showing Data

1. **Check beacon script** - Verify script is present on all pages
2. **Check ad blockers** - Cloudflare Web Analytics is privacy-first but some blockers may interfere
3. **Check token** - Ensure analytics token is correct
4. **Wait 24 hours** - Initial data may take time to populate

### Core Web Vitals Failing

1. **LCP > 2.5s:**
   - Optimize images (use WebP, lazy loading)
   - Reduce server response time
   - Remove render-blocking resources

2. **FID > 100ms:**
   - Minimize JavaScript execution
   - Code splitting
   - Use web workers for heavy computation

3. **CLS > 0.1:**
   - Add size attributes to images
   - Reserve space for dynamic content
   - Avoid inserting content above existing content

---

## Cost Summary

### Free Tier Includes:
- ✅ Cloudflare Web Analytics - **FREE** (unlimited)
- ✅ Cloudflare Browser Insights - **FREE**
- ✅ GitHub Actions - **2,000 minutes/month** (plenty for this project)
- ✅ GitHub Dependabot - **FREE**
- ✅ GitHub Code Scanning - **FREE** (for public repos)

**Total monthly cost: $0**

---

*Last Updated: December 2025*
