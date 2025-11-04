/**
 * Cloudflare Pages Function: /api/crisis
 * Get current active crisis updates
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
                title,
                summary,
                impact,
                severity,
                start_date,
                end_date,
                content_html,
                action_items,
                source,
                source_url,
                created_at,
                updated_at
            FROM crisis_updates
            WHERE active = 1
            AND (end_date IS NULL OR end_date >= DATE('now'))
            ORDER BY severity DESC, start_date DESC
            LIMIT 5
        `).all();

        // Parse JSON fields
        const crisisUpdates = results.map((c: any) => ({
            ...c,
            action_items: c.action_items ? JSON.parse(c.action_items) : null,
        }));

        return new Response(JSON.stringify({
            success: true,
            data: crisisUpdates,
            count: crisisUpdates.length
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });

    } catch (error) {
        console.error('Error fetching crisis updates:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to fetch crisis updates'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
