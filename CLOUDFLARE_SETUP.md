# Cloudflare Pages Setup Instructions

## Quick Setup (via Cloudflare Dashboard)

Since the API requires GitHub integration authorization, the fastest way to deploy is through the Cloudflare Dashboard:

### Step 1: Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Navigate to **Workers & Pages** → **Pages**
4. Click **Create a project** → **Connect to Git**
5. Authorize Cloudflare to access your GitHub account
6. Select the **ginahoangmoore.com** repository

### Step 2: Configure Build Settings

Use these exact settings:

```
Project name: ginahoangmoore
Production branch: main
Build command: (leave empty)
Build output directory: public
Root directory: (leave empty)
```

### Step 3: Deploy

1. Click **Save and Deploy**
2. Wait for the initial deployment to complete (~1-2 minutes)
3. You'll get a `*.pages.dev` URL automatically

### Step 4: Connect Custom Domain

1. In the Pages project settings, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `ginahoangmoore.com`
4. Cloudflare will automatically configure DNS for you
5. (Optional) Add `www.ginahoangmoore.com` as well

## Configuration Files

### Cloudflare Pages Configuration

The site will work with zero configuration since we're using static files in the `public/` directory.

For future reference, you can add a `wrangler.toml` file for advanced configuration:

```toml
name = "ginahoangmoore"
compatibility_date = "2025-11-04"
pages_build_output_dir = "public"

[env.production]
name = "ginahoangmoore"
route = "ginahoangmoore.com/*"

[env.preview]
name = "ginahoangmoore-preview"
```

## Automatic Deployments

Once connected, Cloudflare Pages will automatically:

- ✅ Deploy every push to `main` branch to production
- ✅ Deploy every pull request to a preview URL
- ✅ Run builds in parallel
- ✅ Provide instant rollbacks
- ✅ Include free SSL/TLS certificates

## Useful Commands

```bash
# To update the site, just push to GitHub:
git add .
git commit -m "Update site"
git push origin main

# Cloudflare automatically deploys within 1-2 minutes
```

## Expected URLs

After setup:

- **Production:** https://ginahoangmoore.com
- **Cloudflare Pages:** https://ginahoangmoore.pages.dev
- **GitHub Repository:** https://github.com/PatientVibes/ginahoangmoore.com

## Troubleshooting

### DNS Not Updating
- Wait 24-48 hours for global DNS propagation
- Check nameservers are pointed to Cloudflare
- Use `dig ginahoangmoore.com` to verify

### Build Fails
- Ensure `public/` directory exists
- Check that `index.html` is in `public/`
- Verify no syntax errors in HTML/CSS/JS

### Custom Domain Not Working
1. Go to **DNS** settings for ginahoangmoore.com zone
2. Verify CNAME record: `ginahoangmoore.com` → `ginahoangmoore.pages.dev`
3. Enable **Proxied** (orange cloud icon)

## Configuring Cron Triggers (Required for Automated Data Collection)

**Important:** Cloudflare Pages projects do NOT support `[triggers]` in `wrangler.toml`. You must configure cron triggers via the Cloudflare Dashboard.

### Step 1: Navigate to Cron Triggers
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click on your **ginahoangmoore** project
4. Go to **Settings** → **Functions** → **Cron Triggers**

### Step 2: Add Scheduled Functions

Add these two cron schedules:

#### Census Data Sync (Weekly)
- **Schedule:** `0 9 * * 0` (Every Sunday at 9 AM UTC / 3 AM CT)
- **Target:** `/api/census-sync`
- **Purpose:** Updates Census Bureau SNAP participation data for KC metro counties

#### KC Library Event Check (Daily)
- **Schedule:** `0 8 * * *` (Daily at 8 AM UTC / 2 AM CT)
- **Target:** `/api/kclibrary-sync`
- **Purpose:** Checks for new food/resource events at KC public libraries

### Step 3: Verify Cron Triggers
1. Click **Save**
2. Check the **Cron Triggers** list to confirm both are active
3. Initial executions will occur at the next scheduled time

### Troubleshooting Cron Triggers
- **Not firing?** Check function paths match exactly (`/api/census-sync` not `/api/census-sync/`)
- **Errors in logs?** Go to **Logs** → **Real-time Logs** to debug
- **Need to test manually?** Temporarily change schedule to `*/5 * * * *` (every 5 minutes)

---

## GitHub Pro Features Recommendations

Since you have GitHub Pro, leverage these features for this project:

### 1. GitHub Actions (CI/CD)
**Status:** Already available in your repository

**Recommended workflows:**
- **Automated testing:** Run HTML/CSS validators on every push
- **Lighthouse CI:** Automated accessibility and performance audits
- **Link checking:** Verify all external resource links weekly
- **Dependency updates:** Automated security patches

**Example workflow location:** `.github/workflows/test.yml`

### 2. Dependabot Security Alerts
**Setup:**
1. Go to **Settings** → **Code security and analysis**
2. Enable **Dependency graph** ✓
3. Enable **Dependabot alerts** ✓
4. Enable **Dependabot security updates** ✓

**Benefit:** Automatic pull requests for security vulnerabilities

### 3. Branch Protection Rules
**Setup:**
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✓ Require pull request reviews (optional for solo projects)
   - ✓ Require status checks to pass before merging
   - ✓ Require branches to be up to date before merging

**Benefit:** Prevents accidental direct pushes to production

### 4. GitHub Code Scanning
**Setup:**
1. Go to **Security** → **Code scanning**
2. Click **Set up Code scanning**
3. Choose **CodeQL Analysis**
4. Select **Default** configuration

**Benefit:** Automatic vulnerability detection in JavaScript/TypeScript

### 5. GitHub Projects (Beta)
**Setup:**
1. Go to **Projects** tab
2. Create a new project
3. Link issues/PRs to track progress

**Benefit:** Visual task management for Phase 3, 4, etc.

### 6. GitHub Pages (Already Using)
**Current setup:** `chrispaulmoore.com` hosted via GitHub Pages

**Additional feature:** Enable **Source** tracking for deployment logs

### Recommended Priorities
1. **High Priority:** Enable Dependabot (5 minutes setup)
2. **Medium Priority:** Add branch protection rules (if working with collaborators)
3. **Optional:** GitHub Actions for automated testing (future phase)

---

## Next Steps

After deployment:

1. **Test the site:** Visit https://ginahoangmoore.com
2. **Configure cron triggers:** Follow steps above for automated data collection
3. **Enable GitHub Pro features:** Set up Dependabot and branch protection
4. **Verify mobile:** Check responsive design on phone
5. **Check accessibility:** Use browser DevTools Lighthouse
6. **Monitor analytics:** Enable Cloudflare Web Analytics (free)
7. **Set up Workers:** For API endpoints (Phase 3)

## Cloudflare Pages Features Used

- ✅ **Instant deployments** - Sub-second edge deployment
- ✅ **Git-based workflow** - Deploy on every push
- ✅ **Global CDN** - 275+ cities worldwide
- ✅ **Free SSL** - Automatic HTTPS
- ✅ **Preview deployments** - Test PRs before merging
- ✅ **Analytics** - Free privacy-first analytics
- ⏳ **Workers integration** - Coming soon for API
- ⏳ **D1 Database** - Coming soon for data storage

---

**Status:** Ready for manual deployment via Cloudflare Dashboard
**Estimated Time:** 5-10 minutes
**Cost:** $0 (Free tier sufficient)
