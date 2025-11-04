/**
 * State SNAP Report Collection Worker
 *
 * Collects monthly SNAP participation data from Missouri and Kansas state agencies
 *
 * Data sources:
 * - Missouri DSS: Monthly Management Reports (PDF)
 *   URL: https://dss.mo.gov/re/pdf/fsd_mhdmr/MMYY-family-support-mohealthnet-report.pdf
 *   Counties: Jackson, Clay, Platte
 *
 * - Kansas DCF: Monthly Statistical Reports (PDF)
 *   URL: https://www.dcf.ks.gov/services/ees/Pages/Reports.aspx
 *   Counties: Johnson, Wyandotte
 *
 * Status: FRAMEWORK ONLY - Requires PDF parsing implementation
 * Alternative: Manual data entry until automated parsing is available
 */

interface Env {
    DB: D1Database;
}

interface StateSNAPData {
    county: string;
    state: string;
    year: number;
    month: number;
    households: number;
    individuals: number;
    total_benefits?: number;
    avg_benefit_per_household?: number;
    avg_benefit_per_person?: number;
}

// KC Metro counties to track
const MO_COUNTIES = ['Jackson', 'Clay', 'Platte'];
const KS_COUNTIES = ['Johnson', 'Wyandotte'];

/**
 * Fetch Missouri DSS SNAP data
 *
 * Missouri publishes monthly management reports with county-level data:
 * - Report URL pattern: https://dss.mo.gov/re/pdf/fsd_mhdmr/MMYY-family-support-mohealthnet-report.pdf
 * - SNAP data on pages 20-21
 * - Data includes: county, households, persons
 */
async function fetchMissouriSNAPData(year: number, month: number): Promise<StateSNAPData[]> {
    const results: StateSNAPData[] = [];

    // Format month as MM (e.g., "08" for August)
    const monthStr = month.toString().padStart(2, '0');
    // Format year as YY (e.g., "25" for 2025)
    const yearStr = year.toString().slice(-2);

    const reportUrl = `https://dss.mo.gov/re/pdf/fsd_mhdmr/${monthStr}${yearStr}-family-support-mohealthnet-report.pdf`;

    try {
        // TODO: Implement PDF parsing
        // Options:
        // 1. Use PDF parsing library (pdf-parse, pdfjs-dist)
        // 2. Use external service (Adobe PDF Services API, AWS Textract)
        // 3. Manual data entry until automated solution available

        console.log(`Would fetch Missouri report: ${reportUrl}`);
        console.log('PDF parsing not yet implemented');

        // Placeholder - return empty for now
        return results;

    } catch (error) {
        console.error(`Failed to fetch Missouri SNAP data for ${year}-${month}:`, error);
        return results;
    }
}

/**
 * Fetch Kansas DCF SNAP data
 *
 * Kansas publishes monthly statistical reports:
 * - Reports page: https://www.dcf.ks.gov/services/ees/Pages/Reports.aspx
 * - Data includes: county, households, persons, benefits
 */
async function fetchKansasSNAPData(year: number, month: number): Promise<StateSNAPData[]> {
    const results: StateSNAPData[] = [];

    try {
        // TODO: Implement Kansas report fetching
        // Kansas reports may be in different format than Missouri

        console.log(`Would fetch Kansas report for ${year}-${month}`);
        console.log('Kansas report parsing not yet implemented');

        return results;

    } catch (error) {
        console.error(`Failed to fetch Kansas SNAP data for ${year}-${month}:`, error);
        return results;
    }
}

/**
 * Store state SNAP data in D1 database
 */
async function storeStateSNAPData(db: D1Database, data: StateSNAPData[]): Promise<void> {
    for (const row of data) {
        try {
            await db.prepare(`
                INSERT INTO snap_participation
                (county, state, year, month, households, individuals,
                 total_benefits_dollars, average_benefit_per_household, average_benefit_per_person,
                 data_source, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(county, state, year, month)
                DO UPDATE SET
                    households = excluded.households,
                    individuals = excluded.individuals,
                    total_benefits_dollars = excluded.total_benefits_dollars,
                    average_benefit_per_household = excluded.average_benefit_per_household,
                    average_benefit_per_person = excluded.average_benefit_per_person,
                    updated_at = CURRENT_TIMESTAMP
            `).bind(
                row.county,
                row.state,
                row.year,
                row.month,
                row.households,
                row.individuals,
                row.total_benefits || null,
                row.avg_benefit_per_household || null,
                row.avg_benefit_per_person || null,
                `${row.state} State Agency`
            ).run();

        } catch (error) {
            console.error(`Failed to store data for ${row.county}, ${row.state}:`, error);
        }
    }
}

/**
 * Main handler - Manual data entry endpoint
 *
 * Accepts JSON data for manual entry until automated parsing is available
 *
 * POST body example:
 * {
 *   "county": "Jackson",
 *   "state": "MO",
 *   "year": 2025,
 *   "month": 8,
 *   "households": 45123,
 *   "individuals": 87456,
 *   "total_benefits": 15234567
 * }
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const data: StateSNAPData[] = await request.json();

        // Validate data structure
        if (!Array.isArray(data)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Expected array of SNAP data records'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Store data
        await storeStateSNAPData(env.DB, data);

        return new Response(JSON.stringify({
            success: true,
            message: `Stored ${data.length} SNAP records`,
            records: data.length
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('State SNAP data entry failed:', error);
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
 * GET handler - Status and information
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
    return new Response(JSON.stringify({
        success: true,
        message: 'State SNAP data collection endpoint',
        status: 'Manual entry only - PDF parsing not yet implemented',
        sources: {
            missouri: {
                url: 'https://dss.mo.gov/re/pdf/fsd_mhdmr/MMYY-family-support-mohealthnet-report.pdf',
                counties: MO_COUNTIES,
                format: 'PDF (pages 20-21)',
                frequency: 'Monthly'
            },
            kansas: {
                url: 'https://www.dcf.ks.gov/services/ees/Pages/Reports.aspx',
                counties: KS_COUNTIES,
                format: 'PDF/Excel',
                frequency: 'Monthly'
            }
        },
        usage: {
            method: 'POST',
            endpoint: '/api/state-snap-sync',
            body_example: {
                county: 'Jackson',
                state: 'MO',
                year: 2025,
                month: 8,
                households: 45123,
                individuals: 87456,
                total_benefits: 15234567
            }
        }
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};

/**
 * Scheduled handler (Cloudflare Workers Cron)
 * Runs monthly on the 15th at 4 AM CT
 *
 * Note: Currently disabled until PDF parsing is implemented
 */
export const onScheduled: PagesFunction<Env> = async ({ env }) => {
    console.log('State SNAP sync scheduled run - currently disabled (PDF parsing not implemented)');

    // TODO: Implement when PDF parsing is ready
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth(); // Previous month
    //
    // const moData = await fetchMissouriSNAPData(year, month);
    // const ksData = await fetchKansasSNAPData(year, month);
    //
    // await storeStateSNAPData(env.DB, [...moData, ...ksData]);
};
