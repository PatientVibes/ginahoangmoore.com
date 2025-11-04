# KC Food Security Hub - Database Documentation

## Database: kc-food-security
**ID:** `542916a2-a743-4932-8d73-643d02bf5110`
**Type:** Cloudflare D1 (SQLite)

---

## Current Status

**Local Database:** ✅ Populated with 14 verified resources
**Remote Database:** ⚠️ Needs to be populated (requires API token setup)

---

## Resources Summary

### Total: 14 Verified Resources

**By Category:**
- **Food Assistance (1):** 3 resources
  - United Way 211
  - Harvesters
  - SNAP Applications (MO/KS)

- **Food Pantries (7):** 2 resources
  - Community Services League
  - Catholic Charities
  - Don Bosco Centers

- **SNAP Assistance (9):** 2 resources
  - Missouri SNAP Application
  - Kansas SNAP Application

- **Housing (3):** 2 resources
  - Legal Aid of Western Missouri
  - reStart Inc.

- **Utilities (11):** 2 resources
  - LIHEAP Missouri
  - LIHEAP Kansas

- **Mental Health (4):** 3 resources
  - 988 Suicide & Crisis Lifeline
  - Swope Health
  - ReDiscover

---

## Database Commands

### View Local Database
```bash
# Count resources
npx wrangler d1 execute kc-food-security --command="SELECT COUNT(*) FROM resources"

# List all resources
npx wrangler d1 execute kc-food-security --command="SELECT id, name, category_id, phone_formatted FROM resources"

# Resources by category
npx wrangler d1 execute kc-food-security --command="SELECT name FROM resources WHERE category_id = 1"
```

### Load Seed Data
```bash
# Load into local database
npx wrangler d1 execute kc-food-security --file=database/seed-data-simple.sql

# Load into REMOTE (production) database
# REQUIRES: CLOUDFLARE_API_TOKEN environment variable
npx wrangler d1 execute kc-food-security --remote --file=database/seed-data-simple.sql
```

### Clear Database
```bash
# Delete all resources (local)
npx wrangler d1 execute kc-food-security --command="DELETE FROM resources"

# Delete all resources (remote)
npx wrangler d1 execute kc-food-security --remote --command="DELETE FROM resources"
```

---

## Data Files

### `seed-data-simple.sql`
**Purpose:** Initial verified resources for KC metro area
**Resources:** 14 essential services
**Status:** ✅ Production-ready
**Source:** Verified from official websites (Nov 2025)

**Includes:**
- United Way 211 (24/7 helpline)
- Harvesters (regional food bank)
- SNAP application portals (MO/KS)
- Major food pantries (Community Services League, Catholic Charities, Don Bosco)
- Housing resources (Legal Aid, reStart Inc.)
- Utility assistance (LIHEAP MO/KS)
- Mental health crisis services (988, Swope Health, ReDiscover)

### `seed-data.sql` (archived)
**Purpose:** Original detailed seed data
**Status:** ⚠️ Had column count issues - use `seed-data-simple.sql` instead

---

## Pushing to Production

### Option 1: Manual Export/Import (Current Approach)
Since remote access requires API token setup:

1. **Export from local:**
   ```bash
   npx wrangler d1 export kc-food-security --output=database/export.sql
   ```

2. **Import to remote** (when API token is configured):
   ```bash
   CLOUDFLARE_API_TOKEN=xxx npx wrangler d1 execute kc-food-security --remote --file=database/export.sql
   ```

### Option 2: Via Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **D1**
3. Select `kc-food-security` database
4. Use **Console** tab to run SQL commands
5. Copy/paste contents of `seed-data-simple.sql`

---

## Schema Reference

### Key Tables

**resources** - Main resource directory
- `id` - Auto-increment primary key
- `name` - Resource name
- `category_id` - Foreign key to resource_categories
- `description` - Brief description
- `phone` / `phone_formatted` - Contact numbers
- `website` - Official URL
- `address`, `city`, `state`, `zip` - Physical location
- `hours_of_operation` - When available
- `services_provided` - What they offer
- `eligibility_criteria` - Who qualifies
- `verified` - Boolean (1 = verified)
- `data_source` - Where info came from

**resource_categories**
- `id` - Category ID
- `name` - Category name
- `slug` - URL-friendly slug
- `icon` - Emoji icon
- `parent_category_id` - For subcategories

---

## Maintenance

### Adding New Resources

1. **Verify information** from official source
2. **Add to seed file** or insert directly:
   ```sql
   INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, verified, data_source)
   VALUES ('New Resource', 1, 'Description', '1234567890', '(123) 456-7890', 'https://example.com', 1, 'example.com');
   ```
3. **Test locally** first
4. **Push to production** when ready

### Updating Existing Resources

```sql
UPDATE resources
SET phone_formatted = '(816) 555-1234',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Verifying Resources

```sql
UPDATE resources
SET verified = 1,
    verified_at = CURRENT_TIMESTAMP,
    verified_by = 'Your Name'
WHERE id = 1;
```

---

## API Integration

The resources in this database are served via:
- `/api/resources?category=food`
- `/api/resources?category=housing`
- `/api/resources?category=utilities`
- `/api/resources?category=mental-health`

See `functions/api/resources.ts` for API implementation.

---

## Next Steps

1. ✅ Load seed data into local database
2. ⏳ **Configure Cloudflare API token** for remote access
3. ⏳ **Push seed data to production** database
4. ⏳ Add 20-30 more verified resources (goal: 50+ total)
5. ⏳ Set up automated verification checks
6. ⏳ Implement resource submission form for community updates

---

## Resources to Add (Future)

### High Priority:
- More Harvesters partner pantries (10-15)
- Additional mental health clinics (5-10)
- More housing resources (shelters, rent assistance programs)
- WIC offices (MO/KS)
- Community Action agencies

### Medium Priority:
- Healthcare clinics (FQHCs)
- Job training programs
- Childcare assistance
- Transportation resources
- Legal services

### Research Sources:
- **Harvesters Network Directory:** https://www.harvesters.org/get-help/find-help
- **United Way 211 Database:** Partner for data access
- **KC Library Community Resources:** https://www.kclibrary.org
- **MARC Regional Data:** https://www.marc.org
- **Feeding America Locator:** https://www.feedingamerica.org/find-your-local-foodbank

---

*Last Updated: November 4, 2025*
*Database Version: 1.0*
