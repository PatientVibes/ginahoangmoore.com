/**
 * Food Insecurity Data API Endpoint
 *
 * Provides food insecurity statistics for Kansas City metro counties
 * Data sourced from Feeding America Map the Meal Gap
 *
 * Endpoints:
 * - GET /api/food-insecurity - All counties, latest year
 * - GET /api/food-insecurity?county=Jackson&state=MO - Specific county
 * - GET /api/food-insecurity?year=2023 - Specific year
 */

interface Env {
    DB: D1Database;
}

interface FoodInsecurityRow {
    id: number;
    county: string;
    state: string;
    year: number;
    overall_rate: number;
    child_rate: number;
    senior_rate?: number;
    cost_per_meal: number;
    meal_gap: number;
    food_insecure_persons: number;
    food_insecure_children: number;
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
                overall_rate, child_rate, senior_rate,
                cost_per_meal, meal_gap,
                food_insecure_persons, food_insecure_children,
                data_source, updated_at
            FROM food_insecurity
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
            query += ` AND year = (SELECT MAX(year) FROM food_insecurity)`;
        }

        query += ` ORDER BY state, county`;

        // Execute query
        let statement = env.DB.prepare(query);
        if (params.length > 0) {
            statement = statement.bind(...params);
        }

        const result = await statement.all<FoodInsecurityRow>();

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
            acc.total_food_insecure += row.food_insecure_persons || 0;
            acc.total_food_insecure_children += row.food_insecure_children || 0;
            acc.total_meal_gap += row.meal_gap || 0;
            acc.county_count += 1;
            acc.total_overall_rate += row.overall_rate || 0;
            acc.total_child_rate += row.child_rate || 0;
            return acc;
        }, {
            total_food_insecure: 0,
            total_food_insecure_children: 0,
            total_meal_gap: 0,
            county_count: 0,
            total_overall_rate: 0,
            total_child_rate: 0
        });

        const avgOverallRate = totals.county_count > 0
            ? (totals.total_overall_rate / totals.county_count).toFixed(1)
            : 0;

        const avgChildRate = totals.county_count > 0
            ? (totals.total_child_rate / totals.county_count).toFixed(1)
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
                    food_insecure_persons: totals.total_food_insecure,
                    food_insecure_children: totals.total_food_insecure_children,
                    meal_gap: totals.total_meal_gap,
                    avg_overall_rate: avgOverallRate,
                    avg_child_rate: avgChildRate
                },
                last_updated: result.results[0]?.updated_at || null,
                data_source: 'Feeding America Map the Meal Gap'
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
        console.error('Food insecurity query error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
