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

## Next Steps

After deployment:

1. **Test the site:** Visit https://ginahoangmoore.com
2. **Verify mobile:** Check responsive design on phone
3. **Check accessibility:** Use browser DevTools Lighthouse
4. **Monitor analytics:** Enable Cloudflare Web Analytics (free)
5. **Set up Workers:** For API endpoints (future phase)

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
