/**
 * Admin API for managing resource submissions
 * GET /api/submissions?status=pending - List submissions by status
 * GET /api/submissions?stats=true - Get submission statistics
 * POST /api/submissions/approve?id=X - Approve a submission
 * POST /api/submissions/reject?id=X - Reject a submission
 */

interface Env {
    DB: D1Database;
}

interface Submission {
    id: number;
    name: string;
    category_id: number;
    description: string;
    phone?: string;
    phone_formatted?: string;
    email?: string;
    website?: string;
    address?: string;
    city: string;
    state: string;
    zip: string;
    hours_of_operation?: string;
    services_provided: string;
    data_source?: string;
    status: string;
    submitted_at: string;
    reviewed_at?: string;
    reviewer_notes?: string;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
    const { request, env } = context;
    const url = new URL(request.url);

    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        // Check if requesting stats
        if (url.searchParams.get('stats') === 'true') {
            const stats = await getSubmissionStats(env.DB);
            return new Response(JSON.stringify(stats), {
                headers,
                status: 200
            });
        }

        // Get status filter (default to 'pending')
        const status = url.searchParams.get('status') || 'pending';

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid status. Must be pending, approved, or rejected'
            }), {
                headers,
                status: 400
            });
        }

        // Query submissions
        const submissions = await getSubmissionsByStatus(env.DB, status);

        return new Response(JSON.stringify({
            success: true,
            count: submissions.length,
            data: submissions
        }), {
            headers,
            status: 200
        });

    } catch (error) {
        console.error('Error fetching submissions:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'An error occurred while fetching submissions'
        }), {
            headers,
            status: 500
        });
    }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
    const { request, env } = context;
    const url = new URL(request.url);

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const id = url.searchParams.get('id');
        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Submission ID is required'
            }), {
                headers,
                status: 400
            });
        }

        const submissionId = parseInt(id, 10);
        if (isNaN(submissionId)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid submission ID'
            }), {
                headers,
                status: 400
            });
        }

        // Check if this is approve or reject action based on path
        const isApprove = url.pathname.includes('/approve');
        const isReject = url.pathname.includes('/reject');

        if (!isApprove && !isReject) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid action. Use /approve or /reject'
            }), {
                headers,
                status: 400
            });
        }

        if (isApprove) {
            await approveSubmission(env.DB, submissionId);
            return new Response(JSON.stringify({
                success: true,
                message: 'Submission approved and added to resources'
            }), {
                headers,
                status: 200
            });
        } else {
            await rejectSubmission(env.DB, submissionId);
            return new Response(JSON.stringify({
                success: true,
                message: 'Submission rejected'
            }), {
                headers,
                status: 200
            });
        }

    } catch (error) {
        console.error('Error processing submission action:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'An error occurred while processing the action'
        }), {
            headers,
            status: 500
        });
    }
}

export async function onRequestOptions(): Promise<Response> {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
        status: 204
    });
}

// Helper functions

async function getSubmissionsByStatus(db: D1Database, status: string): Promise<Submission[]> {
    const result = await db
        .prepare(`
            SELECT
                s.*,
                c.name as category_name
            FROM resource_submissions s
            LEFT JOIN resource_categories c ON s.category_id = c.id
            WHERE s.status = ?
            ORDER BY s.submitted_at DESC
        `)
        .bind(status)
        .all();

    return result.results as Submission[];
}

async function getSubmissionStats(db: D1Database): Promise<{ pending: number; approved: number; rejected: number }> {
    const result = await db
        .prepare(`
            SELECT
                status,
                COUNT(*) as count
            FROM resource_submissions
            GROUP BY status
        `)
        .all();

    const stats = {
        pending: 0,
        approved: 0,
        rejected: 0
    };

    for (const row of result.results as { status: string; count: number }[]) {
        stats[row.status as keyof typeof stats] = row.count;
    }

    return stats;
}

async function approveSubmission(db: D1Database, id: number): Promise<void> {
    // First, get the submission
    const submission = await db
        .prepare('SELECT * FROM resource_submissions WHERE id = ?')
        .bind(id)
        .first() as Submission;

    if (!submission) {
        throw new Error('Submission not found');
    }

    // Insert into resources table
    await db
        .prepare(`
            INSERT INTO resources (
                name, category_id, description, phone, phone_formatted,
                email, website, address, city, state, zip,
                hours_of_operation, services_provided,
                verified, data_source
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        `)
        .bind(
            submission.name,
            submission.category_id,
            submission.description,
            submission.phone || null,
            submission.phone_formatted || null,
            submission.email || null,
            submission.website || null,
            submission.address || null,
            submission.city,
            submission.state,
            submission.zip,
            submission.hours_of_operation || null,
            submission.services_provided,
            submission.data_source || 'Community Submission'
        )
        .run();

    // Update submission status
    await db
        .prepare(`
            UPDATE resource_submissions
            SET status = 'approved',
                reviewed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)
        .bind(id)
        .run();
}

async function rejectSubmission(db: D1Database, id: number): Promise<void> {
    await db
        .prepare(`
            UPDATE resource_submissions
            SET status = 'rejected',
                reviewed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)
        .bind(id)
        .run();
}
