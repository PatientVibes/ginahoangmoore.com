# GinaHoangMoore.com - KC Food Security Hub

> **Live Site:** [https://ginahoangmoore.com](https://ginahoangmoore.com)

Interactive food security resource platform for Kansas City metro residents, featuring ZIP code search, bilingual support, and 97+ verified community resources.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Pages](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Pages-orange)](https://ginahoangmoore.com)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen)](https://status.ginahoangmoore.com)

---

## 🎯 Mission

Provide accessible, real-time information about food assistance, SNAP benefits, and community resources in the Kansas City metro area during critical times.

---

## ✨ Features

### 🔍 ZIP Code Search
Enter your ZIP code to find resources near you, sorted by distance with interactive filters.

### 🌐 Bilingual Support
Homepage available in **English** and **Spanish** (Español)

### 📊 Data Dashboard
Interactive visualizations of KC metro food insecurity rates and SNAP participation

### 📱 Mobile-First Design
Responsive, accessible interface optimized for mobile devices

### ✅ Verified Resources
97+ verified organizations across 6 categories:
- 🍎 Food Assistance
- 🏠 Housing Support
- 💡 Utility Help
- 🧠 Mental Health Services
- 🏥 Healthcare Resources
- 💰 Financial Aid

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account (free tier)
- Wrangler CLI: `npm install -g wrangler`

### Local Development

```bash
# Clone repository
git clone https://github.com/PatientVibes/ginahoangmoore.com.git
cd ginahoangmoore.com

# Install dependencies
npm install

# Start development server
npx wrangler pages dev public

# Or use simple HTTP server
npx serve public
```

### Deploy to Cloudflare Pages

```bash
# Deploy via Wrangler
npx wrangler pages deploy public --project-name=ginahoangmoore-com

# Or push to main branch (auto-deploys)
git push origin main
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Cloudflare Global Network           │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐      ┌───────────────┐  │
│  │  Pages   │◄────►│  Functions    │  │
│  │ (Static) │      │  (API)        │  │
│  └──────────┘      └───────┬───────┘  │
│                             │           │
│                    ┌────────▼───────┐  │
│                    │  D1 Database   │  │
│                    │  (SQLite)      │  │
│                    └────────────────┘  │
└─────────────────────────────────────────┘
           │
           ▼
    [External Data Sources]
    - USDA, Census Bureau
    - State SNAP agencies
    - Feeding America
```

---

## 📁 Project Structure

```
ginahoangmoore.com/
├── public/                    # Static site files
│   ├── index.html            # Homepage (English)
│   ├── es/index.html         # Homepage (Spanish)
│   ├── resources/            # Category pages
│   │   ├── search.html       # ZIP search results
│   │   ├── food.html
│   │   ├── housing.html
│   │   └── ...
│   ├── data.html             # Data dashboard
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript
│   └── data/                 # JSON data files
├── functions/
│   └── api/
│       └── resources.ts      # API endpoint
├── database/
│   ├── schema.sql            # Database schema
│   ├── seed-data-*.sql       # Resource data
│   └── zipcodes-*.sql        # ZIP coordinates
├── docs/
│   ├── archive/              # Historical docs
│   └── ...
├── CLAUDE.md                 # AI-optimized docs
├── README.md                 # This file
└── wrangler.toml             # Cloudflare config
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5/CSS3** - Semantic markup, custom properties
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Data visualizations
- **Design Tokens** - Maintainable theming system

### Backend
- **Cloudflare Pages** - Static hosting + Functions
- **Cloudflare D1** - SQLite database (97 resources)
- **TypeScript** - API endpoint logic
- **Haversine Formula** - ZIP code distance calculation

### Monitoring & Analytics
- **UptimeRobot** - 24/7 uptime monitoring (5 endpoints)
- **Cloudflare Web Analytics** - Privacy-friendly analytics
- **Google Search Console** - SEO monitoring
- **Bing Webmaster Tools** - Search indexing

---

## 📊 Current Status

| Metric | Value |
|--------|-------|
| **Resources** | 97 verified organizations |
| **Pages** | 14 (13 EN + 1 ES) |
| **Uptime** | 100% (monitored) |
| **API Response** | <200ms avg |
| **SEO** | Sitemap submitted |

---

## 🎨 Key Pages

- **[Homepage](https://ginahoangmoore.com)** - ZIP search, quick stats, crisis alerts
- **[Spanish Homepage](https://ginahoangmoore.com/es/)** - Full Spanish translation
- **[ZIP Search](https://ginahoangmoore.com/resources/search)** - Distance-based resource finder
- **[Data Dashboard](https://ginahoangmoore.com/data)** - Food security statistics
- **[Crisis Info](https://ginahoangmoore.com/crisis)** - Emergency contacts

---

## 🤝 Contributing

Contributions welcome! This project serves the Kansas City community.

### Ways to Help

1. **Report Issues** - Found outdated info? [Open an issue](https://github.com/PatientVibes/ginahoangmoore.com/issues)
2. **Add Resources** - Know a verified organization? Submit a PR
3. **Improve Code** - Fix bugs, enhance features
4. **Translate** - Help expand Spanish or add new languages
5. **Spread the Word** - Share with those who need help

### Development Workflow

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature

# 3. Make changes
# 4. Test locally
npx wrangler pages dev public

# 5. Commit with clear message
git commit -m "Add feature: description"

# 6. Push and create PR
git push origin feature/your-feature
```

---

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - AI-optimized project documentation
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Detailed project status
- **[Database README](database/README.md)** - Schema & data documentation
- **[Monitoring Guide](MONITORING_SETUP.md)** - UptimeRobot configuration
- **[SEO Guide](SEO_OPTIMIZATION.md)** - SEO implementation details

---

## 📊 Data Sources

We aggregate data from 10+ verified sources:

### Federal
- USDA Food & Nutrition Service
- U.S. Census Bureau ACS

### State
- Missouri Department of Social Services
- Kansas DCF Economic Services

### Regional
- Feeding America (Map the Meal Gap)
- Harvesters Community Food Network
- Mid-America Regional Council (MARC)
- United Way 211 Kansas City

---

## 🔐 Privacy & Security

- ✅ No personal data collection
- ✅ No user accounts or login
- ✅ Privacy-friendly analytics (Cloudflare)
- ✅ HTTPS enforced
- ✅ GDPR compliant
- ✅ No cookies (except functional)

---

## 📞 Emergency Contacts

**Featured on site for immediate help:**

- **211** - United Way helpline (food, housing, utilities)
- **988** - Crisis & suicide prevention lifeline
- **(877) 653-9519** - Harvesters food bank

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Harvesters Community Food Network** - KC metro food bank
- **United Way of Greater Kansas City** - 211 referral services
- **Feeding America** - National food insecurity data
- **Kansas City community** - For inspiring this work

---

## 📧 Contact

- **Project Owner:** Chris Moore ([@PatientVibes](https://github.com/PatientVibes))
- **Email:** chris.paul.moore@gmail.com
- **Issues:** [GitHub Issues](https://github.com/PatientVibes/ginahoangmoore.com/issues)
- **Status Page:** [status.ginahoangmoore.com](https://status.ginahoangmoore.com)

---

## 🌟 Recent Updates

**November 5, 2025:**
- ✅ Fixed category page JavaScript errors
- ✅ Added Pete's Garden and Kanbe's Markets (97 total resources)
- ✅ Comprehensive Playwright testing completed
- ✅ Documentation streamlined and AI-optimized

**November 4-5, 2025:**
- ✅ ZIP code search fully functional
- ✅ Spanish homepage translation
- ✅ SEO optimization (sitemap, structured data)
- ✅ UptimeRobot monitoring (5 endpoints)
- ✅ Cloudflare Web Analytics integrated

---

**Built with ❤️ for the Kansas City community**

*Helping connect residents to food security resources when they need them most*
