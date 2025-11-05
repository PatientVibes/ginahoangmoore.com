/**
 * Category Page JavaScript
 * Loads resources for a specific category
 * Usage: <script src="/js/category-page.js" data-category="food"></script>
 */

document.addEventListener('DOMContentLoaded', () => {
    const script = document.currentScript || document.querySelector('script[data-category]');
    const category = script ? script.getAttribute('data-category') : null;

    if (!category) {
        console.error('No category specified. Add data-category attribute to script tag.');
        return;
    }

    loadCategoryResources(category);
});

async function loadCategoryResources(category) {
    const loading = document.getElementById('loading');
    const resourcesContainer = document.getElementById('resources-container');
    const errorContainer = document.getElementById('error-container');

    try {
        const response = await fetch(`/api/resources?category=${category}`);
        const { success, data } = await response.json();

        if (!success || !data || data.length === 0) {
            throw new Error('No resources found');
        }

        if (loading) loading.style.display = 'none';
        if (resourcesContainer) resourcesContainer.style.display = 'grid';

        resourcesContainer.innerHTML = data.map(resource => renderResource(resource, category)).join('');

    } catch (error) {
        console.error('Error loading resources:', error);
        if (loading) loading.style.display = 'none';
        if (errorContainer) errorContainer.style.display = 'block';
    }
}

function renderResource(resource, category) {
    return `
        <div class="resource-item" data-category="${category}">
            <div class="resource-header">
                <div>
                    <h3 class="resource-title">${escapeHtml(resource.name)}</h3>
                    ${resource.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
                </div>
                <span class="resource-category">${resource.category_icon || '📍'} ${escapeHtml(resource.category_name)}</span>
            </div>

            ${resource.description ? `<p class="resource-description">${escapeHtml(resource.description)}</p>` : ''}

            <div class="resource-details">
                ${resource.phone_formatted ? `
                    <div class="detail-row">
                        <span class="detail-label">📞 Phone:</span>
                        <span class="detail-value">${escapeHtml(resource.phone_formatted)}</span>
                    </div>
                ` : ''}

                ${resource.address ? `
                    <div class="detail-row">
                        <span class="detail-label">📍 Address:</span>
                        <span class="detail-value">
                            ${escapeHtml(resource.address)}${resource.city ? `, ${escapeHtml(resource.city)}` : ''}${resource.state ? `, ${resource.state}` : ''}${resource.zip ? ` ${resource.zip}` : ''}
                        </span>
                    </div>
                ` : resource.city ? `
                    <div class="detail-row">
                        <span class="detail-label">📍 Location:</span>
                        <span class="detail-value">
                            ${escapeHtml(resource.city)}${resource.state ? `, ${resource.state}` : ''}${resource.county ? ` (${escapeHtml(resource.county)} County)` : ''}
                        </span>
                    </div>
                ` : ''}

                ${resource.hours_of_operation ? `
                    <div class="detail-row">
                        <span class="detail-label">🕐 Hours:</span>
                        <span class="detail-value">${escapeHtml(formatHours(resource.hours_of_operation))}</span>
                    </div>
                ` : ''}

                ${resource.eligibility_criteria ? `
                    <div class="detail-row">
                        <span class="detail-label">✅ Eligibility:</span>
                        <span class="detail-value">${escapeHtml(resource.eligibility_criteria)}</span>
                    </div>
                ` : ''}

                ${resource.restrictions ? `
                    <div class="detail-row">
                        <span class="detail-label">⚠️ Note:</span>
                        <span class="detail-value">${escapeHtml(resource.restrictions)}</span>
                    </div>
                ` : ''}
            </div>

            ${resource.services_provided && resource.services_provided.length ? `
                <div class="services-list">
                    ${(typeof resource.services_provided === 'string'
                        ? resource.services_provided.split(',').map(s => s.trim())
                        : resource.services_provided
                    ).map(service => `
                        <span class="service-tag">${escapeHtml(service)}</span>
                    `).join('')}
                </div>
            ` : ''}

            <div class="resource-actions">
                ${resource.phone ? `
                    <a href="tel:${resource.phone}" class="action-btn action-call">📞 Call Now</a>
                ` : ''}
                ${resource.website ? `
                    <a href="${escapeHtml(resource.website)}" target="_blank" rel="noopener noreferrer" class="action-btn action-website">🌐 Visit Website</a>
                ` : ''}
                ${resource.volunteer_url ? `
                    <a href="${escapeHtml(resource.volunteer_url)}" target="_blank" rel="noopener noreferrer" class="action-btn action-volunteer">🙋 Volunteer</a>
                ` : ''}
                ${resource.donation_url ? `
                    <a href="${escapeHtml(resource.donation_url)}" target="_blank" rel="noopener noreferrer" class="action-btn action-donate">💝 Donate</a>
                ` : ''}
                ${resource.donation_button_html ? `
                    <div class="donation-button-container">${resource.donation_button_html}</div>
                ` : ''}
            </div>
        </div>
    `;
}

function formatHours(hours) {
    if (typeof hours === 'string') {
        return hours;
    }
    if (hours && hours.note) {
        return hours.note;
    }
    if (hours && hours.phone_hours) {
        return hours.phone_hours;
    }

    // Format object hours
    if (hours && typeof hours === 'object') {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const formatted = days
            .filter(day => hours[day])
            .map(day => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day]}`)
            .join(', ');
        return formatted || 'Contact for hours';
    }

    return 'Contact for hours';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
