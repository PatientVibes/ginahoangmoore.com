# API Documentation

Cloudflare Pages Functions provide serverless API endpoints with direct access to D1 database.

## Base URL
- **Production:** `https://ginahoangmoore.com/api`
- **Preview:** `https://[branch].ginahoangmoore.pages.dev/api`

## Endpoints

### 1. Get Categories
**GET** `/api/categories`

Returns all resource categories with counts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Food Assistance",
      "slug": "food",
      "icon": "🍎",
      "color": "#10b981",
      "description": "Food pantries, meal programs, SNAP assistance",
      "resource_count": 12
    }
  ]
}
```

---

### 2. Get Resources
**GET** `/api/resources`

Returns resources with optional filtering.

**Query Parameters:**
- `category` (string): Filter by category slug (e.g., `food`, `utilities`)
- `zip` (string): Filter by ZIP code
- `search` (string): Search by name or description
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset (default: 0)

**Examples:**
```
GET /api/resources?category=food
GET /api/resources?zip=64108
GET /api/resources?search=pantry&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Harvesters Community Food Network",
      "category_name": "Food Assistance",
      "category_slug": "food",
      "phone": "8776539519",
      "phone_formatted": "(877) 653-9519",
      "website": "https://www.harvesters.org",
      "address": null,
      "city": "Kansas City",
      "state": "MO",
      "zip": null,
      "county": "Regional",
      "hours_of_operation": {
        "note": "Call for assistance and pantry locations"
      },
      "services_provided": [
        "Food bank network",
        "Pantry locator",
        "Mobile distributions"
      ],
      "verified": 1
    }
  ],
  "count": 1,
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### 3. Search by ZIP Code
**GET** `/api/search`

Search resources near a ZIP code with smart distance prioritization.

**Query Parameters:**
- `zip` (string, required): 5-digit ZIP code
- `category` (string, optional): Filter by category slug
- `limit` (number): Max results (default: 20)

**Examples:**
```
GET /api/search?zip=64108
GET /api/search?zip=66101&category=food
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 6,
      "name": "Metro Lutheran Ministry - Central Food Pantry",
      "distance_priority": 0,
      ...
    }
  ],
  "meta": {
    "zip": "64108",
    "isKCMetro": true,
    "resultCount": 5,
    "message": "Found 5 resources near 64108"
  }
}
```

**Distance Priority:**
- 0 = Exact ZIP match
- 1 = Same county/area
- 2 = Same state
- 3 = Regional

---

### 4. Get Crisis Updates
**GET** `/api/crisis`

Returns active crisis alerts and updates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "SNAP Benefit Alert: November 2025",
      "summary": "November 2025 benefits delayed due to federal shutdown.",
      "impact": "150,000 recipients affected...",
      "severity": "critical",
      "start_date": "2025-11-01",
      "end_date": null,
      "content_html": "<p>...</p>",
      "source": "KC SNAP REVISED.md"
    }
  ],
  "count": 1
}
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error

---

## CORS

All endpoints support CORS with `Access-Control-Allow-Origin: *`

---

## Caching

- Categories: 1 hour
- Resources: 5 minutes
- Search: 10 minutes
- Crisis: 5 minutes

---

## Rate Limiting

Cloudflare Pages Functions have generous limits:
- 100,000 requests/day (free tier)
- 10ms CPU time per request

---

## Usage Examples

### JavaScript (Fetch API)
```javascript
// Get food resources
const response = await fetch('https://ginahoangmoore.com/api/resources?category=food');
const { data } = await response.json();

// Search by ZIP
const searchResponse = await fetch('https://ginahoangmoore.com/api/search?zip=64108');
const { data: resources, meta } = await searchResponse.json();
console.log(`Found ${meta.resultCount} resources near ${meta.zip}`);
```

### cURL
```bash
# Get all categories
curl https://ginahoangmoore.com/api/categories

# Search for food resources near ZIP 64108
curl "https://ginahoangmoore.com/api/search?zip=64108&category=food"

# Get current crisis updates
curl https://ginahoangmoore.com/api/crisis
```

---

## Local Development

```bash
# Run local dev server with D1 bindings
wrangler pages dev public --d1=DB=kc-food-security

# Test API locally
curl http://localhost:8788/api/categories
```

---

## Deployment

Functions automatically deploy with Cloudflare Pages when pushing to GitHub:

```bash
git add functions/
git commit -m "Update API endpoints"
git push origin main
# Deploys in ~1 minute
```
