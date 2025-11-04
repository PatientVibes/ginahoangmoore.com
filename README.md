# GinaHoangMoore.com - KC Metro SNAP & Food Security Platform

> Interactive, data-driven resource platform for Kansas City metro food assistance and community support

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Pages](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Pages-orange)](https://ginahoangmoore.com)

## 🎯 Mission

Provide comprehensive, accessible, and real-time information about SNAP benefits, food security, and community resources in the Kansas City metropolitan area. Empowering residents to find help and enabling advocates to understand the data behind food insecurity.

## 📊 Project Status

- [x] Project planning & documentation
- [x] GitHub repository created
- [x] Basic homepage wireframe complete
- [ ] Cloudflare Pages deployment
- [ ] Database schema & setup (Cloudflare D1)
- [ ] Data collection pipeline
- [ ] Interactive resource finder
- [ ] Data visualization dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for local development)
- Cloudflare account (free tier)
- Wrangler CLI (`npm install -g wrangler`)

### Local Development

```bash
# Clone the repository
git clone https://github.com/PatientVibes/ginahoangmoore.com.git
cd ginahoangmoore.com

# Install dependencies (when package.json is added)
npm install

# Run local development server
npm run dev

# Or serve the static site directly
npx serve public
```

### Deployment

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy public --project-name=ginahoangmoore
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Cloudflare Global Network             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │  Pages       │      │  Workers     │        │
│  │  (Frontend)  │◄────►│  (API)       │        │
│  └──────────────┘      └──────┬───────┘        │
│                               │                 │
│                               ▼                 │
│                        ┌──────────────┐         │
│                        │  D1 Database │         │
│                        │  (SQLite)    │         │
│                        └──────────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  External Data Sources│
           │  - Census API         │
           │  - State SNAP reports │
           │  - Feeding America    │
           │  - MARC dashboards    │
           └───────────────────────┘
```

## 📁 Project Structure

```
ginahoangmoore.com/
├── public/                 # Static site files (deployed to Pages)
│   ├── index.html          # Homepage
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Client-side JavaScript
│   └── images/             # Static assets
├── src/                    # Source files (future: React/Svelte build)
├── workers/                # Cloudflare Workers (API endpoints)
├── database/               # D1 database schemas & migrations
├── scripts/                # Data collection & ETL scripts
├── docs/                   # Documentation
│   ├── CLAUDE.md           # Comprehensive project plan
│   ├── KC SNAP - *.md      # Resource guides & corrections
│   └── data-sources.md     # Data source documentation
├── .gitignore
├── wrangler.toml           # Cloudflare configuration (coming soon)
├── package.json            # Node dependencies (coming soon)
└── README.md               # This file
```

## 🎨 Features

### Current (v0.1 - Static Wireframe)
- ✅ Responsive homepage design
- ✅ Crisis alert banner
- ✅ ZIP code search interface
- ✅ Resource category navigation
- ✅ Key statistics dashboard
- ✅ Mobile-friendly layout
- ✅ Accessibility (WCAG 2.1 AA)

### Planned (v1.0 - MVP)
- [ ] Interactive resource finder with geolocation
- [ ] Cloudflare D1 database with verified resources
- [ ] ZIP code-based search & filtering
- [ ] Real-time crisis updates
- [ ] Eligibility calculator
- [ ] Mobile PWA support

### Future (v2.0+)
- [ ] Data visualization dashboards (Chart.js/D3)
- [ ] Multi-language support (Spanish priority)
- [ ] SMS alerts via Twilio
- [ ] Agency portal for resource updates
- [ ] Volunteer/donor matching
- [ ] API for third-party integrations

## 📊 Data Sources

We aggregate data from 15+ verified sources:

### Federal
- **USDA FNS** - SNAP participation & funding
- **U.S. Census Bureau** - ACS demographic data

### State
- **Missouri DSS** - MO SNAP caseloads
- **Kansas DCF** - KS SNAP data

### Regional
- **Feeding America** - Food insecurity rates
- **Harvesters** - Local food bank data
- **MARC** - KC metro indicators

See [CLAUDE.md](CLAUDE.md#data-sources--collection-strategy) for full list and API details.

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (future: React/Svelte)
- **Hosting:** Cloudflare Pages
- **API:** Cloudflare Workers (serverless)
- **Database:** Cloudflare D1 (SQLite)
- **Maps:** Mapbox GL JS / Leaflet (planned)
- **Charts:** Chart.js / Recharts (planned)
- **Analytics:** Cloudflare Web Analytics (privacy-first)

## 🤝 Contributing

Contributions welcome! This is a community project aimed at helping Kansas City residents.

### How to Help

1. **Data Collection** - Help verify resource information
2. **Development** - Build features, fix bugs
3. **Design** - Improve UI/UX, create graphics
4. **Content** - Write documentation, translate
5. **Testing** - Report issues, test on different devices

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Harvesters Community Food Network** - KC metro food bank
- **United Way of Greater Kansas City** - 211 referral services
- **Feeding America** - National food insecurity data
- **Mid-America Regional Council** - Regional planning data
- **Kansas City community** - For inspiring this project

## 📞 Contact

- **Project Lead:** Chris Moore
- **GitHub:** [@PatientVibes](https://github.com/PatientVibes)
- **Website:** [ginahoangmoore.com](https://ginahoangmoore.com)
- **Issues:** [GitHub Issues](https://github.com/PatientVibes/ginahoangmoore.com/issues)

## 🔗 Important Links

- [Project Documentation (CLAUDE.md)](CLAUDE.md)
- [KC SNAP Crisis Guide](KC%20SNAP%20Benefit%20Assistance%20Planning%20-%20REVISED.md)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

**Built with ❤️ for the Kansas City community**

*Data updated: November 4, 2025*
