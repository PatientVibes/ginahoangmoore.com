/**
 * Cloudflare Pages Function: /api/search
 * Search resources by ZIP code with distance calculation
 */

interface Env {
    DB: D1Database;
}

// KC Metro ZIP codes (simplified - expand in production)
const KC_METRO_ZIPS = new Set([
    // Missouri - Jackson County (sample)
    '64012', '64013', '64014', '64015', '64016', '64050', '64055', '64056', '64057', '64063', '64064', '64081', '64086', '64108', '64109', '64110', '64111', '64112', '64113', '64114', '64116', '64117', '64118', '64119', '64120', '64123', '64124', '64125', '64126', '64127', '64128', '64129', '64130', '64131', '64132', '64133', '64134', '64136', '64137', '64138', '64145', '64146', '64147', '64149', '64150', '64151', '64152', '64153', '64154', '64155', '64156', '64157', '64158',
    // Kansas - Johnson & Wyandotte Counties (sample)
    '66012', '66013', '66018', '66021', '66030', '66051', '66061', '66062', '66083', '66085', '66101', '66102', '66103', '66104', '66105', '66106', '66109', '66110', '66111', '66112', '66115', '66118', '66201', '66202', '66203', '66204', '66205', '66206', '66207', '66208', '66209', '66210', '66211', '66212', '66213', '66214', '66215', '66216', '66217', '66218', '66219', '66220', '66221', '66223', '66224', '66226', '66227'
]);

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    const zip = url.searchParams.get('zip');
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    if (!zip) {
        return new Response(JSON.stringify({
            success: false,
            error: 'ZIP code is required'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // Validate ZIP format
    if (!/^\d{5}$/.test(zip)) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Invalid ZIP code format. Must be 5 digits.'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // Check if ZIP is in KC metro
    const isKCMetro = KC_METRO_ZIPS.has(zip);

    try {
        let query = `
            SELECT
                r.*,
                rc.name as category_name,
                rc.slug as category_slug,
                rc.icon as category_icon,
                CASE
                    WHEN r.zip = ? THEN 0
                    WHEN r.county IS NOT NULL AND r.county LIKE ? THEN 1
                    WHEN r.state IS NOT NULL THEN 2
                    ELSE 3
                END as distance_priority
            FROM resources r
            LEFT JOIN resource_categories rc ON r.category_id = rc.id
            WHERE r.verified = 1
        `;

        const params: any[] = [zip, `%${zip.substring(0, 3)}%`];

        if (category) {
            query += ` AND rc.slug = ?`;
            params.push(category);
        }

        query += ` ORDER BY distance_priority ASC, r.name ASC LIMIT ?`;
        params.push(limit);

        const { results } = await env.DB.prepare(query)
            .bind(...params)
            .all();

        // Parse JSON fields
        const resources = results.map((r: any) => ({
            ...r,
            hours_of_operation: r.hours_of_operation ? JSON.parse(r.hours_of_operation) : null,
            services_provided: r.services_provided ? JSON.parse(r.services_provided) : null,
            languages_spoken: r.languages_spoken ? JSON.parse(r.languages_spoken) : null,
        }));

        // Log search for analytics (privacy-friendly)
        await env.DB.prepare(`
            INSERT INTO search_analytics (search_type, search_value, results_count, session_date)
            VALUES ('zip', ?, ?, DATE('now'))
        `).bind(zip, resources.length).run();

        return new Response(JSON.stringify({
            success: true,
            data: resources,
            meta: {
                zip,
                isKCMetro,
                resultCount: resources.length,
                message: isKCMetro
                    ? `Found ${resources.length} resources near ${zip}`
                    : `ZIP code ${zip} may be outside KC metro area. Showing nearest resources.`
            }
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=600' // Cache for 10 minutes
            }
        });

    } catch (error) {
        console.error('Error searching resources:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to search resources'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
