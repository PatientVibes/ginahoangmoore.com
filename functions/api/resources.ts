/**
 * Cloudflare Pages Function: /api/resources
 * Get resources by category, ZIP code, or search query
 */

interface Env {
    DB: D1Database;
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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
    const radius = parseInt(url.searchParams.get('radius') || '25'); // Default 25 miles

    try {
        // If ZIP code provided, get its coordinates
        let userLat: number | null = null;
        let userLon: number | null = null;

        if (zip) {
            const zipResult = await env.DB.prepare('SELECT latitude, longitude FROM zipcodes WHERE zip = ?')
                .bind(zip)
                .first();

            if (zipResult) {
                userLat = zipResult.latitude as number;
                userLon = zipResult.longitude as number;
            }
        }

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

        // Search by name or description
        if (search) {
            query += ` AND (r.name LIKE ? OR r.description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY r.name ASC`;

        // Don't add LIMIT/OFFSET yet if we're doing distance filtering

        const { results } = await env.DB.prepare(query)
            .bind(...params)
            .all();

        // Parse JSON fields and calculate distances
        let resources = results.map((r: any) => {
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

            // Calculate distance if user location is available
            let distance = null;
            if (userLat !== null && userLon !== null) {
                // Try to get resource coordinates from ZIP code
                if (r.zip) {
                    // We'll need to join with zipcodes table, but for now estimate
                    // This will be improved in a follow-up
                    distance = null; // Will be calculated via separate query
                }
            }

            return {
                ...r,
                hours_of_operation: parseField(r.hours_of_operation),
                services_provided: parseField(r.services_provided),
                languages_spoken: parseField(r.languages_spoken),
                distance,
            };
        });

        // Filter by radius if ZIP code was provided
        if (userLat !== null && userLon !== null) {
            // Get ZIP coordinates for resources and calculate distances
            const resourcesWithDistance = await Promise.all(
                resources.map(async (r: any) => {
                    if (r.zip) {
                        const zipData = await env.DB.prepare('SELECT latitude, longitude FROM zipcodes WHERE zip = ?')
                            .bind(r.zip)
                            .first();

                        if (zipData) {
                            const distance = calculateDistance(
                                userLat,
                                userLon,
                                zipData.latitude as number,
                                zipData.longitude as number
                            );
                            return { ...r, distance: Math.round(distance * 10) / 10 }; // Round to 1 decimal
                        }
                    }
                    return { ...r, distance: null };
                })
            );

            // Filter by radius and sort by distance
            resources = resourcesWithDistance
                .filter((r: any) => r.distance === null || r.distance <= radius)
                .sort((a: any, b: any) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                });
        }

        // Apply pagination after distance filtering
        const paginatedResources = resources.slice(offset, offset + limit);

        return new Response(JSON.stringify({
            success: true,
            data: paginatedResources,
            count: paginatedResources.length,
            total: resources.length,
            zip: zip || null,
            userLocation: userLat && userLon ? { lat: userLat, lon: userLon, zip } : null,
            pagination: {
                limit,
                offset,
                hasMore: offset + paginatedResources.length < resources.length
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
