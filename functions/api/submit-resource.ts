/**
 * Cloudflare Pages Function: /api/submit-resource
 * Handle community resource submissions
 *
 * POST endpoint for form submission from /get-involved page
 */

interface Env {
    DB: D1Database;
}

interface SubmissionData {
    name: string;
    category_id: number;
    description: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city: string;
    state: string;
    zip: string;
    hours_of_operation?: string;
    services_provided: string;
    data_source?: string;
}

interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validate submission data
 */
function validateSubmission(data: SubmissionData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Organization name is required' });
    } else if (data.name.length > 200) {
        errors.push({ field: 'name', message: 'Organization name must be less than 200 characters' });
    }

    // Category validation
    if (!data.category_id) {
        errors.push({ field: 'category_id', message: 'Category is required' });
    }

    // Description validation
    if (!data.description || data.description.trim().length === 0) {
        errors.push({ field: 'description', message: 'Description is required' });
    } else if (data.description.length < 10) {
        errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
    } else if (data.description.length > 1000) {
        errors.push({ field: 'description', message: 'Description must be less than 1000 characters' });
    }

    // City validation
    if (!data.city || data.city.trim().length === 0) {
        errors.push({ field: 'city', message: 'City is required' });
    }

    // State validation
    if (!data.state) {
        errors.push({ field: 'state', message: 'State is required' });
    } else if (!['MO', 'KS'].includes(data.state)) {
        errors.push({ field: 'state', message: 'State must be MO or KS' });
    }

    // ZIP code validation
    if (!data.zip) {
        errors.push({ field: 'zip', message: 'ZIP code is required' });
    } else if (!/^\d{5}$/.test(data.zip)) {
        errors.push({ field: 'zip', message: 'ZIP code must be 5 digits' });
    }

    // Services validation
    if (!data.services_provided || data.services_provided.trim().length === 0) {
        errors.push({ field: 'services_provided', message: 'Services provided is required' });
    }

    // Optional phone validation (if provided)
    if (data.phone) {
        // Remove common formatting characters
        const cleanPhone = data.phone.replace(/[\s\-\(\)\.]/g, '');
        if (!/^\d{10}$/.test(cleanPhone)) {
            errors.push({ field: 'phone', message: 'Phone number must be 10 digits' });
        }
    }

    // Optional email validation (if provided)
    if (data.email && data.email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push({ field: 'email', message: 'Invalid email format' });
        }
    }

    // Optional website validation (if provided)
    if (data.website && data.website.trim().length > 0) {
        try {
            new URL(data.website);
        } catch {
            errors.push({ field: 'website', message: 'Invalid website URL' });
        }
    }

    return errors;
}

/**
 * Sanitize input string
 */
function sanitize(input: string | undefined): string | null {
    if (!input) return null;
    return input.trim().slice(0, 500); // Limit length as additional safety
}

/**
 * POST handler for resource submissions
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        // Parse request body
        let data: SubmissionData;

        try {
            data = await request.json();
        } catch (parseError) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid JSON in request body'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Validate submission
        const validationErrors = validateSubmission(data);

        if (validationErrors.length > 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Validation failed',
                errors: validationErrors
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Sanitize all inputs
        const sanitizedData = {
            name: sanitize(data.name)!,
            category_id: data.category_id,
            description: sanitize(data.description)!,
            phone: sanitize(data.phone),
            email: sanitize(data.email),
            website: sanitize(data.website),
            address: sanitize(data.address),
            city: sanitize(data.city)!,
            state: data.state,
            zip: data.zip,
            hours_of_operation: sanitize(data.hours_of_operation),
            services_provided: sanitize(data.services_provided)!,
            data_source: sanitize(data.data_source) || 'Community Submission'
        };

        // Insert into database
        await env.DB.prepare(`
            INSERT INTO resource_submissions (
                name, category_id, description,
                phone, email, website,
                address, city, state, zip,
                hours_of_operation, services_provided,
                data_source, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `).bind(
            sanitizedData.name,
            sanitizedData.category_id,
            sanitizedData.description,
            sanitizedData.phone,
            sanitizedData.email,
            sanitizedData.website,
            sanitizedData.address,
            sanitizedData.city,
            sanitizedData.state,
            sanitizedData.zip,
            sanitizedData.hours_of_operation,
            sanitizedData.services_provided,
            sanitizedData.data_source
        ).run();

        // Success response
        return new Response(JSON.stringify({
            success: true,
            message: 'Thank you! Your resource submission has been received and will be reviewed shortly.'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        // Log error for debugging
        console.error('Error processing submission:', error);

        // Return generic error to user
        return new Response(JSON.stringify({
            success: false,
            error: 'An error occurred while processing your submission. Please try again later.'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};

/**
 * OPTIONS handler for CORS preflight
 */
export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
};
