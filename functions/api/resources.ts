/**
 * Cloudflare Pages Function: /api/resources
 * Get resources by category, ZIP code, or search query
 */

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    // Parse query parameters
    const category = url.searchParams.get('category');
    const zip = url.searchParams.get('zip');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
        let query = `
            SELECT
                r.*,
                rc.name as category_name,
                rc.slug as category_slug,
                rc.icon as category_icon
            FROM resources r
            LEFT JOIN resource_categories rc ON r.category_id = rc.id
            WHERE r.verified = 1
        `;

        const params: any[] = [];

        // Filter by category
        if (category) {
            query += ` AND rc.slug = ?`;
            params.push(category);
        }

        // Filter by ZIP code
        if (zip) {
            query += ` AND r.zip = ?`;
            params.push(zip);
        }

        // Search by name or description
        if (search) {
            query += ` AND (r.name LIKE ? OR r.description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY r.name ASC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const { results } = await env.DB.prepare(query)
            .bind(...params)
            .all();

        // Parse JSON fields (handle both JSON and plain text formats)
        const resources = results.map((r: any) => {
            const parseField = (field: any) => {
                if (!field) return null;
                if (typeof field === 'string') {
                    // Try to parse as JSON, if it fails, return as-is
                    try {
                        return JSON.parse(field);
                    } catch {
                        return field;
                    }
                }
                return field;
            };

            return {
                ...r,
                hours_of_operation: parseField(r.hours_of_operation),
                services_provided: parseField(r.services_provided),
                languages_spoken: parseField(r.languages_spoken),
            };
        });

        return new Response(JSON.stringify({
            success: true,
            data: resources,
            count: resources.length,
            pagination: {
                limit,
                offset,
                hasMore: resources.length === limit
            }
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });

    } catch (error) {
        console.error('Error fetching resources:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to fetch resources'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
