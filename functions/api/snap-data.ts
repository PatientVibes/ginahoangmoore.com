/**
 * SNAP Data API Endpoint
 *
 * Provides SNAP participation statistics for Kansas City metro counties
 * Data sourced from U.S. Census Bureau ACS via automated sync
 *
 * Endpoints:
 * - GET /api/snap-data - All counties, latest year
 * - GET /api/snap-data?county=Jackson&state=MO - Specific county
 * - GET /api/snap-data?year=2022 - Specific year
 */

interface Env {
    DB: D1Database;
}

interface SNAPDataRow {
    id: number;
    county: string;
    state: string;
    year: number;
    households_receiving_snap: number;
    total_households: number;
    snap_rate: number;
    median_household_income: number;
    poverty_rate: number;
    data_source: string;
    updated_at: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    // Query parameters
    const county = url.searchParams.get('county');
    const state = url.searchParams.get('state');
    const year = url.searchParams.get('year');

    try {
        let query = `
            SELECT
                id, county, state, year,
                households_receiving_snap,
                total_households,
                snap_rate,
                median_household_income,
                poverty_rate,
                data_source,
                updated_at
            FROM snap_participation
            WHERE 1=1
        `;

        const params: any[] = [];

        // Filter by county
        if (county) {
            query += ` AND LOWER(county) = LOWER(?)`;
            params.push(county);
        }

        // Filter by state
        if (state) {
            query += ` AND UPPER(state) = UPPER(?)`;
            params.push(state);
        }

        // Filter by year (default to latest if not specified)
        if (year) {
            query += ` AND year = ?`;
            params.push(parseInt(year));
        } else {
            // Get only the latest year for each county
            query += ` AND year = (SELECT MAX(year) FROM snap_participation)`;
        }

        // Only get annual Census data (month=0), not monthly state reports
        query += ` AND month = 0`;

        query += ` ORDER BY state, county`;

        // Execute query
        let statement = env.DB.prepare(query);
        if (params.length > 0) {
            statement = statement.bind(...params);
        }

        const result = await statement.all<SNAPDataRow>();

        if (!result.success) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Database query failed'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Calculate KC Metro totals
        const totals = result.results.reduce((acc, row) => {
            acc.total_snap_households += row.households_receiving_snap || 0;
            acc.total_households += row.total_households || 0;
            return acc;
        }, {
            total_snap_households: 0,
            total_households: 0
        });

        const metroSnapRate = totals.total_households > 0
            ? (totals.total_snap_households / totals.total_households * 100).toFixed(2)
            : 0;

        return new Response(JSON.stringify({
            success: true,
            data: result.results,
            meta: {
                count: result.results.length,
                filters: {
                    county: county || 'all',
                    state: state || 'all',
                    year: year || 'latest'
                },
                kc_metro_totals: {
                    snap_households: totals.total_snap_households,
                    total_households: totals.total_households,
                    snap_rate: metroSnapRate
                },
                last_updated: result.results[0]?.updated_at || null
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
            }
        });

    } catch (error) {
        console.error('SNAP data query error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
