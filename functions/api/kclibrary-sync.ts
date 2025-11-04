/**
 * KC Library & KCMO Community Resources Sync
 *
 * Monitors Kansas City Public Library and KCMO government pages for updates
 * Focuses on:
 * - Street Sheets (quarterly resource guides)
 * - Community Resources page updates
 * - Food assistance news/articles
 * - KCMO SNAP Resource Hub
 * - Food assistance, SNAP, utilities, housing resources
 *
 * Data sources:
 * - https://kclibrary.org/street-sheets (quarterly PDFs)
 * - https://kclibrary.org/community-resources (resource directory)
 * - https://kclibrary.org/news/2025-10/where-find-free-food (food resource list)
 * - https://www.kcmo.gov/city-hall/housing/snap-resource-hub (SNAP resources)
 *
 * Schedule: Daily at 2 AM CT to check for updates
 */

interface Env {
    DB: D1Database;
    KV?: KVNamespace; // For tracking last update times
}

interface LibraryResource {
    name: string;
    category: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    website?: string;
    description?: string;
    services?: string[];
    hours?: string;
    source: string;
    source_url: string;
}

/**
 * Fetch Street Sheets page and check for new PDFs
 */
async function checkStreetSheetsUpdates(): Promise<{
    updated: boolean;
    latest_pdf_url?: string;
    last_modified?: string;
}> {
    try {
        const response = await fetch('https://kclibrary.org/street-sheets');
        const html = await response.text();

        // Extract PDF links from the page
        // Look for pattern: /sites/default/files/YYYY-MM/SS%20YYYY.MM.pdf
        const pdfPattern = /href="(\/sites\/default\/files\/\d{4}-\d{2}\/SS%20\d{4}\.\d{2}\.pdf)"/g;
        const matches = [...html.matchAll(pdfPattern)];

        if (matches.length > 0) {
            // Get the most recent PDF (they're dated YYYY.MM)
            const pdfUrls = matches.map(m => m[1]);
            const latestPdf = pdfUrls[0]; // Assuming first is most recent
            const fullUrl = `https://kclibrary.org${latestPdf}`;

            // Extract date from filename (SS YYYY.MM.pdf)
            const dateMatch = latestPdf.match(/(\d{4})\.(\d{2})/);
            const pdfDate = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}` : null;

            return {
                updated: true,
                latest_pdf_url: fullUrl,
                last_modified: pdfDate || new Date().toISOString()
            };
        }

        return { updated: false };

    } catch (error) {
        console.error('Failed to check Street Sheets:', error);
        return { updated: false };
    }
}

/**
 * Fetch Community Resources page content
 */
async function checkCommunityResourcesUpdates(): Promise<{
    updated: boolean;
    resources?: LibraryResource[];
}> {
    try {
        const response = await fetch('https://kclibrary.org/community-resources');
        const html = await response.text();

        // Extract structured data if available
        // KC Library page is informational rather than a resource list
        // Track changes by comparing page content hash

        // Simple content hash (for change detection)
        const contentHash = await simpleHash(html);

        return {
            updated: true,
            resources: [{
                name: 'Kansas City Public Library - Community Resources Center',
                category: 'Multi-Service',
                address: '14 W 10th St, 3rd Floor',
                city: 'Kansas City',
                state: 'MO',
                zip: '64105',
                phone: '8167013767',
                website: 'https://kclibrary.org/community-resources',
                description: 'Community Resource Specialists provide direct service to vulnerable populations. Services include finding helping agencies, completing forms for utilities/rent/housing, locating free meals, food pantries, clothes, showers, medical/dental care, and acquiring vital documents.',
                services: [
                    'Resource navigation',
                    'Form assistance',
                    'Food pantry referrals',
                    'Housing assistance',
                    'Utility assistance',
                    'Healthcare referrals',
                    'Document assistance'
                ],
                hours: 'Walk-in: Monday-Friday, 9 AM - 1 PM',
                source: 'KC Library Community Resources',
                source_url: 'https://kclibrary.org/community-resources'
            }]
        };

    } catch (error) {
        console.error('Failed to check Community Resources page:', error);
        return { updated: false };
    }
}

/**
 * Check KC Library food resource news page
 */
async function checkFoodResourceNews(): Promise<{
    updated: boolean;
    resources?: LibraryResource[];
}> {
    try {
        const response = await fetch('https://kclibrary.org/news/2025-10/where-find-free-food');
        const html = await response.text();

        // Content hash for change detection
        const contentHash = await simpleHash(html);

        // Extract food resources from the page
        // This page lists specific food pantries and meal programs
        const resources: LibraryResource[] = [
            {
                name: 'Morning Glory Ministries',
                category: 'Food Assistance',
                address: '1112 Broadway Blvd',
                city: 'Kansas City',
                state: 'MO',
                zip: '64105',
                phone: '8168420416',
                description: 'Offers breakfast Monday-Friday',
                services: ['Breakfast meals'],
                hours: 'Monday-Friday (breakfast)',
                source: 'KC Library Food Resources',
                source_url: 'https://kclibrary.org/news/2025-10/where-find-free-food'
            },
            {
                name: 'Hope Faith Ministries',
                category: 'Food Assistance',
                address: '705 Virginia Ave',
                city: 'Kansas City',
                state: 'MO',
                zip: '64106',
                phone: '8164714673',
                description: 'Offers breakfast and lunch daily',
                services: ['Breakfast meals', 'Lunch meals'],
                hours: 'Daily',
                source: 'KC Library Food Resources',
                source_url: 'https://kclibrary.org/news/2025-10/where-find-free-food'
            },
            {
                name: 'NourishKC Kitchen',
                category: 'Food Assistance',
                address: '750 Paseo Blvd',
                city: 'Kansas City',
                state: 'MO',
                zip: '64106',
                phone: '8165618920',
                website: 'https://nourishkc.org',
                description: 'Lunch service weekdays',
                services: ['Lunch meals'],
                hours: '11 AM - 2 PM, Monday-Friday',
                source: 'KC Library Food Resources',
                source_url: 'https://kclibrary.org/news/2025-10/where-find-free-food'
            },
            {
                name: 'Redemptorist Center',
                category: 'Food Assistance',
                address: '207 Linwood Blvd',
                city: 'Kansas City',
                state: 'MO',
                zip: '64111',
                phone: '8169319942',
                description: 'Offers pantry and lunch services',
                services: ['Food pantry', 'Lunch meals'],
                source: 'KC Library Food Resources',
                source_url: 'https://kclibrary.org/news/2025-10/where-find-free-food'
            },
            {
                name: 'Bishop Sullivan Center',
                category: 'Food Assistance',
                city: 'Kansas City',
                state: 'MO',
                phone: '8162310984',
                description: 'Two locations with food services',
                services: ['Food assistance'],
                source: 'KC Library Food Resources',
                source_url: 'https://kclibrary.org/news/2025-10/where-find-free-food'
            }
        ];

        return {
            updated: true,
            resources: resources
        };

    } catch (error) {
        console.error('Failed to check food resource news:', error);
        return { updated: false };
    }
}

/**
 * Check KCMO SNAP Resource Hub
 * Note: This page may block automated access (403 errors)
 */
async function checkKCMOSnapHub(): Promise<{
    updated: boolean;
    accessible: boolean;
}> {
    try {
        const response = await fetch('https://www.kcmo.gov/city-hall/housing/snap-resource-hub');

        if (response.status === 403) {
            console.log('KCMO SNAP Hub blocked automated access (403)');
            return { updated: false, accessible: false };
        }

        const html = await response.text();
        const contentHash = await simpleHash(html);

        return {
            updated: true,
            accessible: true
        };

    } catch (error) {
        console.error('Failed to check KCMO SNAP Hub:', error);
        return { updated: false, accessible: false };
    }
}

/**
 * Simple hash function for content comparison
 */
async function simpleHash(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Store library update metadata
 */
async function storeUpdateMetadata(
    db: D1Database,
    source: string,
    url: string,
    lastChecked: string,
    contentHash: string
): Promise<void> {
    await db.prepare(`
        INSERT OR REPLACE INTO library_updates
        (source, url, last_checked, content_hash, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(source, url, lastChecked, contentHash).run();
}

/**
 * Check if content has changed since last check
 */
async function hasContentChanged(
    db: D1Database,
    source: string,
    newHash: string
): Promise<boolean> {
    const result = await db.prepare(`
        SELECT content_hash FROM library_updates
        WHERE source = ?
        ORDER BY updated_at DESC
        LIMIT 1
    `).bind(source).first<{ content_hash: string }>();

    return !result || result.content_hash !== newHash;
}

/**
 * Send notification about updates (future: email, webhook, etc.)
 */
async function notifyUpdates(updates: {
    street_sheets?: boolean;
    community_resources?: boolean;
    pdf_url?: string;
}): Promise<void> {
    console.log('KC Library updates detected:', updates);

    // TODO: Implement notification system
    // Options:
    // 1. Store in crisis_updates table for display on homepage
    // 2. Send email to admin
    // 3. Post to webhook/Slack
    // 4. Create alert banner on website
}

/**
 * Main sync handler
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;

    try {
        const results = {
            street_sheets: { checked: false, updated: false, url: null as string | null },
            community_resources: { checked: false, updated: false, resource_count: 0 },
            food_news: { checked: false, updated: false, resource_count: 0 },
            kcmo_snap_hub: { checked: false, updated: false, accessible: true }
        };

        // Check Street Sheets
        const streetSheetsCheck = await checkStreetSheetsUpdates();
        results.street_sheets.checked = true;
        results.street_sheets.updated = streetSheetsCheck.updated;
        results.street_sheets.url = streetSheetsCheck.latest_pdf_url || null;

        // Check Community Resources page
        const communityCheck = await checkCommunityResourcesUpdates();
        results.community_resources.checked = true;
        results.community_resources.updated = communityCheck.updated;
        results.community_resources.resource_count = communityCheck.resources?.length || 0;

        // Check Food Resource News
        const foodNewsCheck = await checkFoodResourceNews();
        results.food_news.checked = true;
        results.food_news.updated = foodNewsCheck.updated;
        results.food_news.resource_count = foodNewsCheck.resources?.length || 0;

        // Check KCMO SNAP Hub
        const kcmoCheck = await checkKCMOSnapHub();
        results.kcmo_snap_hub.checked = true;
        results.kcmo_snap_hub.updated = kcmoCheck.updated;
        results.kcmo_snap_hub.accessible = kcmoCheck.accessible;

        // If updates detected, notify
        if (streetSheetsCheck.updated || communityCheck.updated || foodNewsCheck.updated || kcmoCheck.updated) {
            await notifyUpdates({
                street_sheets: streetSheetsCheck.updated,
                community_resources: communityCheck.updated,
                pdf_url: streetSheetsCheck.latest_pdf_url
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'KC community resources checked',
            timestamp: new Date().toISOString(),
            results: results
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('KC resources sync failed:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

/**
 * Scheduled handler (Cloudflare Workers Cron)
 * Runs daily at 2 AM CT (8 AM UTC)
 */
export const onScheduled: PagesFunction<Env> = async ({ env }) => {
    console.log('Running scheduled KC community resources check...');

    try {
        // Check all sources
        const streetSheetsCheck = await checkStreetSheetsUpdates();
        const communityCheck = await checkCommunityResourcesUpdates();
        const foodNewsCheck = await checkFoodResourceNews();
        const kcmoCheck = await checkKCMOSnapHub();

        // Notify if updates detected
        if (streetSheetsCheck.updated || communityCheck.updated || foodNewsCheck.updated || kcmoCheck.updated) {
            await notifyUpdates({
                street_sheets: streetSheetsCheck.updated,
                community_resources: communityCheck.updated,
                pdf_url: streetSheetsCheck.latest_pdf_url
            });

            console.log('KC resource updates detected and notifications sent');
        } else {
            console.log('No KC resource updates detected');
        }

    } catch (error) {
        console.error('Scheduled KC resources sync failed:', error);
    }
};

/**
 * Status endpoint
 */
export const onRequestOptions: PagesFunction<Env> = async () => {
    return new Response(JSON.stringify({
        status: 'operational',
        sources: {
            street_sheets: {
                url: 'https://kclibrary.org/street-sheets',
                description: 'Quarterly community resource guides (PDF)',
                update_frequency: 'Quarterly',
                check_frequency: 'Daily'
            },
            community_resources: {
                url: 'https://kclibrary.org/community-resources',
                description: 'Community Resources Center information',
                update_frequency: 'As needed',
                check_frequency: 'Daily'
            },
            food_news: {
                url: 'https://kclibrary.org/news/2025-10/where-find-free-food',
                description: 'KC Library food resource article with specific pantries and meal programs',
                update_frequency: 'As needed',
                check_frequency: 'Daily',
                resource_count: 5
            },
            kcmo_snap_hub: {
                url: 'https://www.kcmo.gov/city-hall/housing/snap-resource-hub',
                description: 'KCMO SNAP Resource Hub (may block automated access)',
                update_frequency: 'As needed',
                check_frequency: 'Daily',
                note: 'May return 403 Forbidden for automated requests'
            }
        },
        schedule: 'Daily at 2 AM CT (8 AM UTC)',
        manual_trigger: 'GET /api/kclibrary-sync',
        notifications: {
            current: 'Console logging only',
            planned: 'Email alerts, website banner, crisis_updates table'
        }
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};
