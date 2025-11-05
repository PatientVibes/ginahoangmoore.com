# Volunteer & Donation Feature Implementation

**Date**: November 5, 2025
**Status**: ✅ Complete and Deployed

---

## Overview

Implemented comprehensive volunteer and donation functionality across the KC Food Security Hub, enabling nonprofits to showcase volunteer opportunities and accept donations directly through resource listings.

---

## Research Phase

### Platforms Evaluated

**Volunteer Management:**
- ✅ **Idealist** - Selected for embedded volunteer search widget (100K+ opportunities)
- POINT - Free volunteer management platform
- SignUpGenius - Signup scheduling
- VolunteerMatch - Merged with Idealist
- Golden Volunteer - AI-powered (enterprise)
- Galaxy Digital - Corporate focused
- Bloomerang Volunteer - CRM integration

**Donation Platforms:**
- ✅ **Givebutter** - 100% free with optional donor tips (recommended)
- ✅ **Stripe** - 2.2% + $0.30 for nonprofits (API integration)
- ✅ **PayPal** - 1.99% + $0.49 for nonprofits (lowest fees)
- GiveWP - WordPress plugin
- Double the Donation - Matching gifts

**Selected Approach:** Hybrid Lightweight Model
- **Volunteer**: Idealist embedded search widget + nonprofit-provided URLs
- **Donations**: Nonprofits provide their own button HTML (PayPal/Stripe/Givebutter)
- **Cost**: $0 for hub, minimal integration complexity

---

## Database Changes

### New Fields Added to `resources` Table

```sql
-- Volunteer fields
volunteer_url TEXT              -- Direct link to volunteer signup
volunteer_opportunities TEXT    -- JSON or CSV list of opportunities

-- Donation fields
donation_url TEXT               -- Direct donation page link
donation_button_html TEXT       -- Custom PayPal/Stripe/Givebutter button
donation_platform TEXT          -- 'paypal', 'stripe', 'givebutter', 'other'

-- Metadata flags
accepts_volunteers INTEGER DEFAULT 0    -- Boolean flag
accepts_donations INTEGER DEFAULT 0     -- Boolean flag

-- Indexes for filtering
CREATE INDEX idx_resources_volunteers ON resources(accepts_volunteers);
CREATE INDEX idx_resources_donations ON resources(accepts_donations);
```

**Migration**: `database/add-volunteer-donation-fields.sql`
**Executed**: November 5, 2025 via wrangler CLI

---

## Frontend Implementation

### 1. Resource Cards Enhancement

**File**: `public/js/category-page.js`

**Added Buttons:**
- 🙋 **Volunteer Button** - Purple button linking to `volunteer_url`
- 💝 **Donate Button** - Red button linking to `donation_url`
- **Custom Donation HTML** - Renders nonprofit-provided PayPal/Stripe buttons

**Example Output:**
```html
<div class="resource-actions">
    <a href="tel:8165551234" class="action-btn action-call">📞 Call Now</a>
    <a href="https://example.org" class="action-btn action-website">🌐 Visit Website</a>
    <a href="https://example.org/volunteer" class="action-btn action-volunteer">🙋 Volunteer</a>
    <a href="https://example.org/donate" class="action-btn action-donate">💝 Donate</a>
</div>
```

### 2. CSS Styling

**File**: `public/css/category-pages.css`

```css
.action-volunteer {
    background: var(--color-mental-health);  /* Purple */
    color: white;
}

.action-donate {
    background: var(--kc-red);  /* Red */
    color: white;
}

.donation-button-container {
    display: inline-block;
    /* Styles for embedded PayPal/Stripe buttons */
}
```

### 3. Category Pages Fixed

**Updated Pages:**
- ✅ `housing.html` - Now loads dynamically from API
- ✅ `utilities.html` - Now loads dynamically from API
- ✅ `mental-health.html` - Now loads dynamically from API
- ✅ `healthcare.html` - Already dynamic
- ✅ `financial.html` - Already dynamic
- ✅ `food.html` - Already dynamic

**Before:** Static fallback content with hardcoded resources
**After:** Loading state → API fetch → Dynamic resource cards with volunteer/donate options

---

## Get Involved Page Redesign

**File**: `public/get-involved.html`

### New Features

**1. Impact Stats Section**
- 125+ resources listed
- 1 in 7 KC residents food insecure
- $1 = 9 meals through Harvesters

**2. Six Involvement Cards**

| Card | Icon | Link | Description |
|------|------|------|-------------|
| **Volunteer Your Time** | 🙋 | Idealist KC search | Find food pantry volunteer opportunities |
| **Make a Donation** | 💝 | Harvesters donate | Support food banks & meal programs |
| **Submit a Resource** | 📝 | /submit-resource | Add missing nonprofits to directory |
| **Advocate for Change** | 📢 | Call 211 | Support SNAP/WIC policy advocacy |
| **Spread the Word** | 🔗 | Twitter share | Social media sharing links |
| **Partner With Us** | 🤝 | Email contact | API/data partnerships |

**3. Platform Badges**
Each card shows supported platforms:
- Volunteer: Idealist, Harvesters, United Way 211
- Donate: PayPal, Stripe, Venmo, Cash App
- Submit: Community-Powered, Admin Verified

**4. Call to Action**
Prominent CTA section with:
- "Every Action Counts" headline
- Quick access buttons
- Inspiring copy

---

## Technical Details

### API Response Format

Resource cards now expect these optional fields:

```json
{
  "id": 1,
  "name": "Harvesters",
  "volunteer_url": "https://www.harvesters.org/volunteer",
  "donation_url": "https://www.harvesters.org/give",
  "donation_button_html": "<form>...</form>",
  "donation_platform": "stripe",
  "accepts_volunteers": 1,
  "accepts_donations": 1
}
```

### Security Considerations

**XSS Protection:**
- All user-provided text fields escaped via `escapeHtml()`
- `donation_button_html` is sanitized on insertion (admin review required)
- CSP headers should be configured for iframe embeds

**Validation:**
- URLs validated as proper format
- HTML buttons reviewed by admin before approval
- Only 501(c)(3) organizations can submit resources

---

## Usage Guide for Nonprofits

### Adding Volunteer Information

**Option 1: Direct URL**
```sql
UPDATE resources
SET volunteer_url = 'https://yourorg.org/volunteer',
    accepts_volunteers = 1
WHERE id = 123;
```

**Option 2: Via Submission Form**
Nonprofits can submit volunteer URL through `/submit-resource` form

### Adding Donation Button

**PayPal Button Example:**
```html
<form action="https://www.paypal.com/donate" method="post" target="_blank">
  <input type="hidden" name="business" value="donations@yourorg.org" />
  <input type="submit" value="Donate with PayPal" />
</form>
```

**Database Insert:**
```sql
UPDATE resources
SET donation_button_html = '<form>...</form>',
    donation_platform = 'paypal',
    accepts_donations = 1
WHERE id = 123;
```

**Givebutter Widget:**
```html
<a href="https://givebutter.com/yourorg" target="_blank" class="btn">Donate</a>
```

---

## Deployment

### Git Commits

1. **564371b** - Add volunteer and donation functionality to resource cards
   - Database schema updates
   - Frontend button rendering
   - CSS styling

2. **e3e84b0** - Fix all category pages to load resources dynamically from API
   - Updated housing, utilities, mental-health pages
   - Consistent loading states across all categories

3. **06790a6** - Completely redesign /get-involved page
   - 6 involvement cards
   - Impact stats
   - Platform badges
   - Mobile responsive

### Cloudflare Deployment

**Status**: ✅ Auto-deployed via GitHub integration
**Live URL**: https://ginahoangmoore.com
**Database**: kc-food-security (ID: 542916a2-a743-4932-8d73-643d02bf5110)

---

## Future Enhancements

### Phase 2 (Optional)

1. **Volunteer Aggregation**
   - Integrate Idealist API to pull opportunities directly
   - Display volunteer events on resource cards
   - Filter resources by "Accepting Volunteers"

2. **Donation Tracking**
   - Partner with Givebutter for embedded widgets
   - Track total donations through platform
   - Display fundraising goals on resource pages

3. **United Way 211 Partnership**
   - API access to their volunteer database
   - Cross-reference our resources with 211 listings
   - Bidirectional data sharing

4. **Mobile Volunteer App**
   - POINT integration for mobile volunteer management
   - Push notifications for volunteer opportunities
   - Check-in/check-out tracking

5. **Corporate Partnerships**
   - Galaxy Digital integration for corporate volunteers
   - Bulk volunteer group signup
   - Employee matching gift programs

---

## Metrics to Track

**Volunteer Engagement:**
- Click-through rate on volunteer buttons
- Most popular volunteer organizations
- Idealist referral traffic

**Donation Performance:**
- Click-through rate on donate buttons
- Most popular donation platforms (PayPal vs Stripe vs Givebutter)
- Conversion rates from resource view → donation

**Resource Submissions:**
- Number of nonprofits adding volunteer/donation info
- Percentage of resources with volunteer URLs
- Percentage of resources with donation buttons

---

## Resources & Documentation

### Research Document
See `/docs/volunteer-donation-platform-research.md` (from agent research)

### Key Platforms
- **Idealist**: https://www.idealist.org/
- **Givebutter**: https://givebutter.com/
- **PayPal Giving**: https://www.paypal.com/us/webapps/mpp/non-profits
- **Stripe for Nonprofits**: https://stripe.com/industries/nonprofits
- **United Way 211 KC**: https://unitedwaygkc.org/211-2/

### Internal Links
- Submit Resource: `/submit-resource`
- Admin Review: `/admin/review-submissions.html`
- Get Involved: `/get-involved`

---

## Testing Checklist

- [x] Database migration successful (9 queries, 259 rows written)
- [x] Resource cards display volunteer/donate buttons when data present
- [x] Buttons hidden when volunteer_url/donation_url are null
- [x] CSS styling correct (purple volunteer, red donate)
- [x] Category pages load dynamically from API
- [x] Get Involved page redesign deployed
- [x] All pages mobile responsive
- [x] Idealist volunteer link works
- [x] Harvesters donation link works
- [x] Submit resource form accessible
- [x] Git commits pushed and deployed

---

## Success Criteria ✅

1. ✅ All category pages load resources dynamically
2. ✅ Resource cards support volunteer & donation CTAs
3. ✅ Database schema supports volunteer/donation data
4. ✅ Get Involved page showcases 6 ways to help
5. ✅ Zero cost implementation for hub
6. ✅ Nonprofits control their own donation/volunteer links
7. ✅ Mobile responsive across all pages
8. ✅ Deployed to production successfully

---

**Implementation Team**: Claude (AI Agent) + Chris Moore
**Total Development Time**: ~3 hours
**Total Cost**: $0 (leveraging free platforms)

