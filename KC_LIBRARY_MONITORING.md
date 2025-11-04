# KC Library Community Resources Monitoring

## Overview

Automated daily monitoring of Kansas City Public Library community resources pages to detect updates to food assistance, SNAP, utilities, housing, and other social service information.

---

## What We Monitor

### 1. Street Sheets (Quarterly Resource Guides)
- **URL**: https://kclibrary.org/street-sheets
- **Format**: Downloadable PDF guides
- **Update Frequency**: Quarterly (every 3 months)
- **Content**: Comprehensive community resource lists including:
  - Food and meal programs
  - Health and personal care
  - Shelter resources
  - Family support services
  - Veterans information
  - Local support agencies

### 2. Community Resources Page
- **URL**: https://kclibrary.org/community-resources
- **Format**: Web page
- **Update Frequency**: As needed
- **Content**: Information about the Community Resources Center at Central Library (3rd floor)
  - Walk-in hours: Monday-Friday, 9 AM - 1 PM
  - Phone: 816.701.3767
  - Services: Resource navigation, form assistance, food pantry referrals, housing/utility help

---

## How It Works

### Automated Monitoring
- **Schedule**: Daily at 2 AM CT (8 AM UTC)
- **Method**: Web scraping and change detection
- **Endpoint**: `/api/kclibrary-sync`

### Detection Methods

#### Street Sheets PDF Monitoring
1. **Check for new PDFs**: Scans the Street Sheets page for updated PDF links
2. **Date extraction**: Identifies PDF date from filename (format: `SS YYYY.MM.pdf`)
3. **Comparison**: Tracks latest PDF URL to detect new quarterly releases
4. **Storage**: Records PDF URL and date in `library_updates` table

#### Community Resources Page Monitoring
1. **Content hashing**: Creates SHA-256 hash of page content
2. **Change detection**: Compares current hash with previous hash
3. **Update tracking**: Flags when content changes
4. **Resource extraction**: Parses page for structured resource information

---

## Database Storage

### library_updates Table
```sql
CREATE TABLE library_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,              -- 'street_sheets' or 'community_resources'
    url TEXT NOT NULL,                 -- URL checked
    last_checked DATETIME NOT NULL,    -- Last check timestamp
    content_hash TEXT,                 -- SHA-256 hash for change detection
    pdf_url TEXT,                      -- Latest Street Sheet PDF URL
    has_changes BOOLEAN DEFAULT 0,     -- Changes detected?
    notified BOOLEAN DEFAULT 0,        -- Admin notified?
    notes TEXT,                        -- Additional notes
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Query Examples
```bash
# View latest Street Sheets PDF
wrangler d1 execute kc-food-security --remote --command \
  "SELECT source, pdf_url, last_checked FROM library_updates WHERE source='street_sheets' ORDER BY updated_at DESC LIMIT 1"

# Check for unnotified updates
wrangler d1 execute kc-food-security --remote --command \
  "SELECT * FROM library_updates WHERE has_changes=1 AND notified=0"
```

---

## Manual Triggering

### Test the sync manually
```bash
# Trigger check via API
curl https://ginahoangmoore.com/api/kclibrary-sync

# Expected response:
{
  "success": true,
  "message": "KC Library resources checked",
  "timestamp": "2025-11-04T08:00:00.000Z",
  "results": {
    "street_sheets": {
      "checked": true,
      "updated": true,
      "url": "https://kclibrary.org/sites/default/files/2025-06/SS%202025.06.pdf"
    },
    "community_resources": {
      "checked": true,
      "updated": false,
      "resource_count": 1
    }
  }
}
```

### View status and configuration
```bash
curl -X OPTIONS https://ginahoangmoore.com/api/kclibrary-sync
```

---

## Notification System (Future Implementation)

When updates are detected, the system will:

### Priority 1: Website Alert Banner
```typescript
// Store update in crisis_updates table
await db.prepare(`
  INSERT INTO crisis_updates
  (title, summary, impact, severity, active, source_url)
  VALUES (?, ?, ?, ?, ?, ?)
`).bind(
  'KC Library Street Sheets Updated',
  'New quarterly resource guide available with updated food assistance and community services information.',
  'New resource information available',
  'info',
  1,
  pdfUrl
).run();
```

### Priority 2: Email Notification (requires email service)
```typescript
// Send email to admin
await sendEmail({
  to: 'admin@ginahoangmoore.com',
  subject: 'KC Library Resources Updated',
  body: `New Street Sheets PDF available: ${pdfUrl}`,
  priority: 'normal'
});
```

### Priority 3: Slack/Discord Webhook (optional)
```typescript
// Post to Slack channel
await fetch(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({
    text: `🔔 KC Library Street Sheets updated: ${pdfUrl}`
  })
});
```

---

## What Happens When Updates Are Detected

### Current Behavior (Phase 1)
1. **Log update**: Console log entry created
2. **Database record**: Update tracked in `library_updates` table
3. **Manual review**: Admin checks database for updates

### Planned Behavior (Phase 2)
1. **Automatic alert**: Crisis banner appears on homepage
2. **Email notification**: Admin receives email alert
3. **Resource extraction**: Attempt to parse PDF for new resources
4. **Database updates**: New resources added to `resources` table
5. **Mark as processed**: Update marked as `notified=1`

---

## PDF Processing Workflow (Future Enhancement)

### Option 1: Manual Processing (Current)
1. System detects new PDF
2. Admin downloads PDF manually
3. Admin extracts resources and enters via `/api/resources` POST
4. Mark update as processed

### Option 2: Semi-Automated Processing (Planned)
1. System detects and downloads new PDF
2. PDF converted to text via parsing library (pdf-parse)
3. Admin reviews extracted text
4. Admin approves resources for import
5. System bulk imports to database

### Option 3: Fully Automated Processing (Future)
1. System detects and downloads new PDF
2. AI/ML model extracts structured resource data
3. System validates extracted data
4. Automatic import to database
5. Email summary sent to admin for review

---

## Street Sheets Content Structure

Based on KC Library documentation, Street Sheets include:

### Resource Categories
- **Food & Meals**: Pantries, meal programs, SNAP assistance
- **Health & Personal Care**: Medical, dental, hygiene services
- **Shelter**: Emergency shelter, transitional housing
- **Family Resources**: Childcare, parenting support, family services
- **Veterans**: VA resources, veteran-specific assistance
- **Local Agencies**: Multi-service organizations

### Information Typically Included
- Organization name
- Address (physical location)
- Phone number
- Services provided
- Hours of operation
- Eligibility requirements
- Languages spoken
- Accessibility notes

---

## Integration with Existing Resources

### Resource Database Sync Strategy

**When KC Library PDF is updated**:
1. Download and parse new PDF
2. Extract food/utility/housing resources
3. **Compare with existing resources**:
   ```sql
   SELECT * FROM resources
   WHERE LOWER(name) LIKE '%[resource_name]%'
   ```
4. **Update if exists**:
   - Update phone, hours, address if changed
   - Add note: "Verified via KC Library Street Sheets YYYY-MM"
5. **Insert if new**:
   - Add new resource to database
   - Mark as verified
   - Set source: "KC Library Street Sheets"

### Example Update Query
```typescript
// Update existing resource
await db.prepare(`
  UPDATE resources
  SET phone = ?, hours_of_operation = ?, verified_at = CURRENT_TIMESTAMP,
      notes = 'Verified via KC Library Street Sheets 2025-06'
  WHERE id = ?
`).bind(newPhone, newHours, resourceId).run();

// Or insert new resource
await db.prepare(`
  INSERT INTO resources (name, category_id, phone, address, services_provided, verified, data_source)
  VALUES (?, ?, ?, ?, ?, 1, 'KC Library Street Sheets 2025-06')
`).bind(name, categoryId, phone, address, services).run();
```

---

## Monitoring Dashboard (Future Feature)

### Planned Metrics
- Last check timestamp
- Number of checks performed
- Updates detected (count)
- Latest PDF URL
- Last notification sent
- Resources updated count
- Resources added count

### API Endpoint (Proposed)
```bash
GET /api/kclibrary-sync/status

Response:
{
  "monitoring": {
    "enabled": true,
    "schedule": "Daily at 2 AM CT",
    "last_check": "2025-11-04T08:00:00Z",
    "next_check": "2025-11-05T08:00:00Z"
  },
  "sources": {
    "street_sheets": {
      "last_update": "2025-06-01",
      "latest_pdf": "https://kclibrary.org/sites/default/files/2025-06/SS%202025.06.pdf",
      "resources_extracted": 0,
      "status": "manual_review_needed"
    },
    "community_resources": {
      "last_update": "2025-06-15",
      "changes_detected": false,
      "status": "up_to_date"
    }
  },
  "notifications": {
    "pending": 1,
    "sent": 3,
    "failed": 0
  }
}
```

---

## Troubleshooting

### Check isn't running
```bash
# Verify Cron Trigger is configured
# Check Cloudflare dashboard: Pages → ginahoangmoore → Functions → Cron Triggers

# Manual test
curl https://ginahoangmoore.com/api/kclibrary-sync
```

### No updates detected when PDF is new
```bash
# Check if PDF URL pattern has changed
curl https://kclibrary.org/street-sheets | grep -o '/sites/default/files/[^"]*\.pdf'

# Verify database records
wrangler d1 execute kc-food-security --remote --command \
  "SELECT * FROM library_updates ORDER BY updated_at DESC LIMIT 5"
```

### False positive updates
```bash
# Page content may change for non-resource reasons (ads, notices)
# Check content hash to see what changed
wrangler d1 execute kc-food-security --remote --command \
  "SELECT content_hash, notes FROM library_updates WHERE source='community_resources' ORDER BY updated_at DESC LIMIT 2"
```

---

## Cost Impact

**No additional cost** - within Cloudflare Free Tier:
- Daily cron execution: 1 request/day = 30 requests/month
- Well under Workers 100K requests/day limit
- Database queries minimal (2-3 per day)
- No external API costs (web scraping is free)

---

## Next Steps

### Immediate (Done)
✅ Create `/api/kclibrary-sync` endpoint
✅ Add daily Cron Trigger (2 AM CT)
✅ Create `library_updates` tracking table
✅ Implement change detection logic

### Short-term (Next Week)
- [ ] Test daily monitoring for 7 days
- [ ] Implement crisis_updates integration (homepage banner)
- [ ] Add email notification system
- [ ] Document manual PDF review process

### Medium-term (Next Month)
- [ ] Implement PDF text extraction (pdf-parse)
- [ ] Create semi-automated resource import workflow
- [ ] Build monitoring dashboard page
- [ ] Add Slack/Discord webhook notifications

### Long-term (Future)
- [ ] Train ML model for automated PDF parsing
- [ ] Integrate with other library systems (JCPL, KCKS, etc.)
- [ ] Expand monitoring to social service agency websites
- [ ] Create public subscription system (email alerts for residents)

---

*Last Updated: November 4, 2025*
*Status: Daily monitoring active, manual review workflow*
