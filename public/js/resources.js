/**
 * Resources Search Page JavaScript
 * Handles ZIP code search and resource display
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('zip-search-form');
    const input = document.getElementById('zip-input');
    const resultsSection = document.getElementById('results-section');
    const loading = document.getElementById('loading');
    const searchMessage = document.getElementById('search-message');
    const resultsContainer = document.getElementById('results-container');

    // Check if ZIP was passed in URL
    const urlParams = new URLSearchParams(window.location.search);
    const zipFromUrl = urlParams.get('zip');
    if (zipFromUrl && /^\d{5}$/.test(zipFromUrl)) {
        input.value = zipFromUrl;
        searchResources(zipFromUrl);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const zip = input.value.trim();
        if (zip && /^\d{5}$/.test(zip)) {
            // Update URL without reload
            window.history.pushState({}, '', `?zip=${zip}`);
            searchResources(zip);
        }
    });
});

async function searchResources(zip) {
    const loading = document.getElementById('loading');
    const searchMessage = document.getElementById('search-message');
    const resultsContainer = document.getElementById('results-container');

    // Show loading
    loading.style.display = 'block';
    searchMessage.style.display = 'none';
    resultsContainer.style.display = 'none';

    try {
        const response = await fetch(`/api/search?zip=${zip}`);
        const { success, data, meta } = await response.json();

        loading.style.display = 'none';

        if (!success || !data || data.length === 0) {
            showMessage(
                'No resources found',
                `We couldn't find resources for ZIP code ${zip}. Try calling 211 for assistance.`,
                'warning'
            );
            return;
        }

        // Show results
        showMessage(
            meta.message || `Found ${data.length} resources`,
            meta.isKCMetro
                ? 'Resources are sorted by distance from your ZIP code'
                : 'This ZIP may be outside KC metro. Showing nearest available resources.',
            'success'
        );

        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div style="margin-bottom: var(--spacing-lg);">
                <h3 style="margin-bottom: var(--spacing-md);">Resources Near ${zip}</h3>
            </div>
            <div class="resource-list">
                ${data.map(resource => renderResource(resource)).join('')}
            </div>
        `;

    } catch (error) {
        console.error('Error searching resources:', error);
        loading.style.display = 'none';
        showMessage(
            'Search Error',
            'Failed to search resources. Please try again later.',
            'error'
        );
    }
}

function showMessage(title, text, type = 'info') {
    const searchMessage = document.getElementById('search-message');
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');

    messageTitle.textContent = title;
    messageText.textContent = text;

    searchMessage.style.display = 'block';

    // Style based on type
    const colors = {
        success: 'var(--color-secondary)',
        warning: 'var(--color-warning)',
        error: 'var(--color-danger)',
        info: 'var(--color-info)'
    };
    messageTitle.style.color = colors[type] || colors.info;
}

function renderResource(resource) {
    return `
        <div class="resource-item" style="background: white; padding: var(--spacing-lg); border-radius: var(--border-radius); box-shadow: var(--box-shadow); border-left: 4px solid var(--color-secondary); margin-bottom: var(--spacing-md);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
                <div>
                    <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--spacing-xs);">${resource.name}</h4>
                    ${resource.verified ? '<span style="background: var(--color-secondary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">✓ Verified</span>' : ''}
                </div>
                <span style="background: var(--color-secondary); color: white; padding: 0.5rem; border-radius: 0.5rem;">${resource.category_icon || '📍'}</span>
            </div>

            ${resource.description ? `<p style="color: var(--color-text-light); margin-bottom: var(--spacing-md);">${resource.description}</p>` : ''}

            <div style="display: grid; gap: var(--spacing-sm);">
                ${resource.phone_formatted ? `
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <strong style="min-width: 80px;">📞 Phone:</strong>
                        <span>${resource.phone_formatted}</span>
                    </div>
                ` : ''}

                ${resource.address || resource.city ? `
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <strong style="min-width: 80px;">📍 Location:</strong>
                        <span>${[resource.address, resource.city, resource.state, resource.zip].filter(Boolean).join(', ')}</span>
                    </div>
                ` : ''}

                ${resource.hours_of_operation ? `
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <strong style="min-width: 80px;">🕐 Hours:</strong>
                        <span>${formatHours(resource.hours_of_operation)}</span>
                    </div>
                ` : ''}

                ${resource.eligibility_criteria ? `
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <strong style="min-width: 80px;">✅ Eligibility:</strong>
                        <span>${resource.eligibility_criteria}</span>
                    </div>
                ` : ''}
            </div>

            ${resource.services_provided && resource.services_provided.length ? `
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: var(--spacing-md);">
                    ${resource.services_provided.map(service => `
                        <span style="background: var(--color-gray-100); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">${service}</span>
                    `).join('')}
                </div>
            ` : ''}

            <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md); flex-wrap: wrap;">
                ${resource.phone ? `
                    <a href="tel:${resource.phone}" style="padding: 0.5rem 1rem; background: var(--color-primary); color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">📞 Call Now</a>
                ` : ''}
                ${resource.website ? `
                    <a href="${resource.website}" target="_blank" rel="noopener" style="padding: 0.5rem 1rem; background: var(--color-gray-200); color: var(--color-gray-800); border-radius: 0.5rem; text-decoration: none; font-weight: 600;">🌐 Website</a>
                ` : ''}
            </div>
        </div>
    `;
}

function formatHours(hours) {
    if (typeof hours === 'string') return hours;
    if (hours.note) return hours.note;
    if (hours.phone_hours) return hours.phone_hours;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const formatted = days
        .filter(day => hours[day])
        .map(day => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day]}`)
        .join(', ');

    return formatted || 'Contact for hours';
}
