/**
 * Census API Data Collection Worker
 *
 * Fetches SNAP participation and demographic data from U.S. Census Bureau API
 * for Kansas City metro counties:
 * - Missouri: Jackson, Clay, Platte
 * - Kansas: Johnson, Wyandotte
 *
 * Data sources:
 * - American Community Survey (ACS) 5-Year Estimates
 * - Table S2201: SNAP/Food Stamps in the Past 12 Months
 *
 * Scheduled via Cloudflare Workers Cron Trigger (weekly)
 */

interface Env {
    DB: D1Database;
    CENSUS_API_KEY?: string;
}

interface CensusResponse {
    data: string[][];
    error?: string;
}

interface CountyData {
    county: string;
    state: string;
    fips_code: string;
    snap_households: number;
    total_households: number;
    snap_rate: number;
    median_income: number;
    poverty_rate: number;
    year: number;
}

// KC Metro counties with FIPS codes
const KC_METRO_COUNTIES = [
    { name: 'Jackson', state: 'MO', state_fips: '29', county_fips: '095' },
    { name: 'Clay', state: 'MO', state_fips: '29', county_fips: '047' },
    { name: 'Platte', state: 'MO', state_fips: '29', county_fips: '165' },
    { name: 'Johnson', state: 'KS', state_fips: '20', county_fips: '091' },
    { name: 'Wyandotte', state: 'KS', state_fips: '20', county_fips: '209' },
];

/**
 * Fetch SNAP participation data from Census ACS API
 */
async function fetchCensusSNAPData(
    censusApiKey: string | undefined,
    year: number = 2022
): Promise<CountyData[]> {
    const results: CountyData[] = [];

    // ACS 5-Year Estimates Table S2201
    // Variables:
    // S2201_C01_001E = Total households
    // S2201_C04_001E = Households receiving SNAP
    // S1901_C01_012E = Median household income
    // S1701_C03_001E = Percent below poverty level

    const variables = [
        'S2201_C01_001E', // Total households
        'S2201_C04_001E', // SNAP households
        'S1901_C01_012E', // Median income
        'S1701_C03_001E'  // Poverty rate
    ].join(',');

    for (const county of KC_METRO_COUNTIES) {
        // Build URL with optional API key
        let url = `https://api.census.gov/data/${year}/acs/acs5/subject?` +
            `get=NAME,${variables}&` +
            `for=county:${county.county_fips}&` +
            `in=state:${county.state_fips}`;

        // Add key parameter if available
        if (censusApiKey) {
            url += `&key=${censusApiKey}`;
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`Census API error for ${county.name}, ${county.state}: ${response.status}`);
                continue;
            }

            const data: string[][] = await response.json();

            // Census API returns [headers, ...data_rows]
            if (data.length < 2) {
                console.error(`No data returned for ${county.name}, ${county.state}`);
                continue;
            }

            const row = data[1]; // First data row
            const totalHouseholds = parseInt(row[1]) || 0;
            const snapHouseholds = parseInt(row[2]) || 0;
            const medianIncome = parseInt(row[3]) || 0;
            const povertyRate = parseFloat(row[4]) || 0;

            results.push({
                county: county.name,
                state: county.state,
                fips_code: `${county.state_fips}${county.county_fips}`,
                snap_households: snapHouseholds,
                total_households: totalHouseholds,
                snap_rate: totalHouseholds > 0 ? (snapHouseholds / totalHouseholds) * 100 : 0,
                median_income: medianIncome,
                poverty_rate: povertyRate,
                year: year
            });

        } catch (error) {
            console.error(`Failed to fetch Census data for ${county.name}, ${county.state}:`, error);
        }
    }

    return results;
}

/**
 * Store Census data in D1 database
 */
async function storeCensusData(db: D1Database, countyData: CountyData[]): Promise<void> {
    for (const data of countyData) {
        try {
            // Insert or update SNAP participation data
            // month=0 indicates annual/yearly data (not monthly state reports)
            await db.prepare(`
                INSERT INTO snap_participation
                (county, state, year, month, households_receiving_snap, total_households, snap_rate,
                 median_household_income, poverty_rate, data_source, updated_at)
                VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(county, state, year, month)
                DO UPDATE SET
                    households_receiving_snap = excluded.households_receiving_snap,
                    total_households = excluded.total_households,
                    snap_rate = excluded.snap_rate,
                    median_household_income = excluded.median_household_income,
                    poverty_rate = excluded.poverty_rate,
                    updated_at = CURRENT_TIMESTAMP
            `).bind(
                data.county,
                data.state,
                data.year,
                data.snap_households,
                data.total_households,
                data.snap_rate,
                data.median_income,
                data.poverty_rate,
                'US Census Bureau ACS 5-Year'
            ).run();

        } catch (error) {
            console.error(`Failed to store data for ${data.county}, ${data.state}:`, error);
        }
    }
}

/**
 * Main handler - can be called via HTTP or Cron
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;

    // Census API key is optional (lower rate limits without key)
    const censusApiKey = env.CENSUS_API_KEY;
    if (censusApiKey) {
        console.log('Using Census API key');
    } else {
        console.log('Operating without Census API key (rate limited to 500 queries/day)');
    }

    try {
        // Fetch latest Census data (2022 ACS 5-Year is most recent)
        console.log('Fetching Census SNAP data...');
        const countyData = await fetchCensusSNAPData(censusApiKey, 2022);

        if (countyData.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'No Census data retrieved'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Store in database
        console.log(`Storing ${countyData.length} county records...`);
        await storeCensusData(env.DB, countyData);

        return new Response(JSON.stringify({
            success: true,
            message: 'Census data synced successfully',
            counties_updated: countyData.length,
            data: countyData
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Census sync failed:', error);
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
 * Runs weekly on Sundays at 3 AM CT
 */
export const onScheduled: PagesFunction<Env> = async ({ env }) => {
    const censusApiKey = env.CENSUS_API_KEY;
    console.log(censusApiKey
        ? 'Running scheduled sync with API key'
        : 'Running scheduled sync without API key (rate limited)');

    try {
        console.log('Running scheduled Census data sync...');
        const countyData = await fetchCensusSNAPData(censusApiKey, 2022);
        await storeCensusData(env.DB, countyData);
        console.log(`Scheduled sync complete: ${countyData.length} counties updated`);
    } catch (error) {
        console.error('Scheduled Census sync failed:', error);
    }
};
