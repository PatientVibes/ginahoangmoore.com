/**
 * Cloudflare Pages Function: /api/categories
 * Get all resource categories
 */

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;

    try {
        const { results } = await env.DB.prepare(`
            SELECT
                id,
                name,
                slug,
                parent_category_id,
                icon,
                color,
                description,
                sort_order,
                (SELECT COUNT(*) FROM resources WHERE category_id = resource_categories.id AND verified = 1) as resource_count
            FROM resource_categories
            WHERE parent_category_id IS NULL
            ORDER BY sort_order ASC
        `).all();

        return new Response(JSON.stringify({
            success: true,
            data: results
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            }
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to fetch categories'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
