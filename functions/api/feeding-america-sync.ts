/**
 * Feeding America "Map the Meal Gap" Data Integration
 *
 * Collects annual food insecurity data from Feeding America
 *
 * Data source:
 * - Feeding America Map the Meal Gap (annual study)
 * - Request form: https://feedingamerica.az1.qualtrics.com/jfe/form/SV_5tJt5m9K62hRC6N
 * - Interactive map: https://map.feedingamerica.org
 *
 * Data includes:
 * - Overall food insecurity rate
 * - Child food insecurity rate
 * - Senior food insecurity rate
 * - Cost per meal
 * - Food budget shortfall
 * - Meal gap (total meals needed)
 *
 * Status: MANUAL ENTRY - Data available via request form
 * Frequency: Annual (released in May with prior year data)
 */

interface Env {
    DB: D1Database;
}

interface FoodInsecurityData {
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
}

// KC Metro counties
const COUNTIES = [
    { name: 'Jackson', state: 'MO', fips: '29095' },
    { name: 'Clay', state: 'MO', fips: '29047' },
    { name: 'Platte', state: 'MO', fips: '29165' },
    { name: 'Johnson', state: 'KS', fips: '20091' },
    { name: 'Wyandotte', state: 'KS', fips: '20209' },
];

/**
 * Store Feeding America data in D1 database
 */
async function storeFoodInsecurityData(db: D1Database, data: FoodInsecurityData[]): Promise<void> {
    for (const row of data) {
        try {
            await db.prepare(`
                INSERT INTO food_insecurity
                (county, state, year, overall_rate, child_rate, senior_rate,
                 cost_per_meal, meal_gap, food_insecure_persons, food_insecure_children,
                 data_source, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(county, state, year)
                DO UPDATE SET
                    overall_rate = excluded.overall_rate,
                    child_rate = excluded.child_rate,
                    senior_rate = excluded.senior_rate,
                    cost_per_meal = excluded.cost_per_meal,
                    meal_gap = excluded.meal_gap,
                    food_insecure_persons = excluded.food_insecure_persons,
                    food_insecure_children = excluded.food_insecure_children,
                    updated_at = CURRENT_TIMESTAMP
            `).bind(
                row.county,
                row.state,
                row.year,
                row.overall_rate,
                row.child_rate,
                row.senior_rate || null,
                row.cost_per_meal,
                row.meal_gap,
                row.food_insecure_persons,
                row.food_insecure_children,
                'Feeding America Map the Meal Gap'
            ).run();

        } catch (error) {
            console.error(`Failed to store data for ${row.county}, ${row.state}:`, error);
        }
    }
}

/**
 * POST handler - Manual data entry
 *
 * Accepts JSON data for manual entry after requesting data from Feeding America
 *
 * POST body example:
 * [
 *   {
 *     "county": "Jackson",
 *     "state": "MO",
 *     "year": 2023,
 *     "overall_rate": 14.2,
 *     "child_rate": 19.8,
 *     "senior_rate": 9.5,
 *     "cost_per_meal": 3.45,
 *     "meal_gap": 32500000,
 *     "food_insecure_persons": 95000,
 *     "food_insecure_children": 25000
 *   }
 * ]
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const data: FoodInsecurityData[] = await request.json();

        // Validate data structure
        if (!Array.isArray(data)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Expected array of food insecurity records'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Store data
        await storeFoodInsecurityData(env.DB, data);

        return new Response(JSON.stringify({
            success: true,
            message: `Stored ${data.length} food insecurity records`,
            records: data.length
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Feeding America data entry failed:', error);
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
    const { env } = context;

    // Get latest data from database
    const result = await env.DB.prepare(`
        SELECT county, state, year, overall_rate, child_rate, cost_per_meal, updated_at
        FROM food_insecurity
        WHERE year = (SELECT MAX(year) FROM food_insecurity)
        ORDER BY state, county
    `).all();

    return new Response(JSON.stringify({
        success: true,
        message: 'Feeding America Map the Meal Gap data integration',
        status: 'Manual entry only - Data available via request form',
        data_source: {
            name: 'Feeding America Map the Meal Gap',
            url: 'https://www.feedingamerica.org/research/map-the-meal-gap/by-county',
            request_form: 'https://feedingamerica.az1.qualtrics.com/jfe/form/SV_5tJt5m9K62hRC6N',
            interactive_map: 'https://map.feedingamerica.org',
            frequency: 'Annual (released in May with prior year data)',
            latest_report: 'Map the Meal Gap 2025 (2023 data)'
        },
        counties_tracked: COUNTIES,
        current_data: {
            records: result.results.length,
            latest_year: result.results[0]?.year || null,
            data: result.results
        },
        usage: {
            method: 'POST',
            endpoint: '/api/feeding-america-sync',
            body_example: {
                county: 'Jackson',
                state: 'MO',
                year: 2023,
                overall_rate: 14.2,
                child_rate: 19.8,
                senior_rate: 9.5,
                cost_per_meal: 3.45,
                meal_gap: 32500000,
                food_insecure_persons: 95000,
                food_insecure_children: 25000
            }
        },
        steps_to_populate: [
            '1. Request data from Feeding America via their form',
            '2. Extract data for KC metro counties (Jackson, Clay, Platte, Johnson, Wyandotte)',
            '3. POST data to this endpoint as JSON array',
            '4. Data will be stored in food_insecurity table',
            '5. Accessible via /api/food-insecurity endpoint'
        ]
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
        }
    });
};
