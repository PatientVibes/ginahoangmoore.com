/**
 * KC Food Security Hub - Main JavaScript
 * Handles interactive features, form submissions, and dynamic content
 */

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initZipSearch();
    initMobileNav();
    initLastUpdated();
});

// ============================================
// ZIP Code Search
// ============================================
function initZipSearch() {
    const form = document.getElementById('zip-search-form');
    const input = document.getElementById('zip-input');

    if (!form || !input) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const zip = input.value.trim();

        // Validate ZIP code
        if (!isValidZip(zip)) {
            showError('Please enter a valid 5-digit ZIP code');
            return;
        }

        // Check if ZIP is in KC metro area
        if (!isKCMetroZip(zip)) {
            showWarning(`ZIP code ${zip} may be outside the KC metro area. Showing nearest resources.`);
        }

        // Redirect to resources page with ZIP parameter
        window.location.href = `/resources?zip=${zip}`;
    });

    // Auto-format ZIP input
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
}

// ============================================
// Mobile Navigation
// ============================================
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.style.display === 'flex';
        menu.style.display = isOpen ? 'none' : 'flex';
        toggle.setAttribute('aria-expanded', !isOpen);

        // Animate hamburger icon
        toggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
        }
    });
}

// ============================================
// Last Updated Timestamp
// ============================================
function initLastUpdated() {
    const element = document.getElementById('last-updated');
    if (!element) return;

    // Format current date or fetch from API in production
    const today = new Date();
    const formatted = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    element.textContent = formatted;
}

// ============================================
// Validation Helpers
// ============================================
function isValidZip(zip) {
    return /^\d{5}$/.test(zip);
}

function isKCMetroZip(zip) {
    // KC Metro area ZIP codes (Missouri & Kansas)
    // This is a simplified list - expand in production
    const kcMetroZips = [
        // Missouri - Jackson County
        64012, 64013, 64014, 64015, 64016, 64017, 64029, 64030, 64034, 64050, 64051, 64052, 64053, 64054, 64055, 64056, 64057, 64058, 64063, 64064, 64065, 64070, 64075, 64081, 64082, 64083, 64086, 64089, 64101, 64102, 64105, 64106, 64108, 64109, 64110, 64111, 64112, 64113, 64114, 64116, 64117, 64118, 64119, 64120, 64121, 64123, 64124, 64125, 64126, 64127, 64128, 64129, 64130, 64131, 64132, 64133, 64134, 64136, 64137, 64138, 64139, 64141, 64145, 64146, 64147, 64149, 64150, 64151, 64152, 64153, 64154, 64155, 64156, 64157, 64158, 64161, 64163, 64164, 64165, 64166, 64167, 64168, 64170, 64171, 64179, 64180, 64184, 64187, 64188, 64190, 64191, 64192, 64193, 64194, 64195, 64196, 64197, 64198, 64199,
        // Missouri - Clay County
        64010, 64011, 64062, 64068, 64072, 64073, 64074, 64088, 64092, 64098,
        // Missouri - Platte County
        64150, 64152, 64153, 64154, 64155, 64156, 64157, 64158, 64161, 64163, 64164, 64165, 64166, 64167, 64195,
        // Kansas - Johnson County
        66006, 66012, 66013, 66018, 66019, 66021, 66030, 66031, 66051, 66061, 66062, 66083, 66085, 66103, 66106, 66109, 66111, 66112, 66201, 66202, 66203, 66204, 66205, 66206, 66207, 66208, 66209, 66210, 66211, 66212, 66213, 66214, 66215, 66216, 66217, 66218, 66219, 66220, 66221, 66222, 66223, 66224, 66225, 66226, 66227, 66250, 66251, 66276, 66279, 66282, 66283, 66285, 66286,
        // Kansas - Wyandotte County
        66101, 66102, 66103, 66104, 66105, 66106, 66109, 66110, 66111, 66112, 66115, 66117, 66118, 66119
    ];

    const zipNum = parseInt(zip, 10);
    return kcMetroZips.includes(zipNum);
}

// ============================================
// Notification System
// ============================================
function showError(message) {
    showNotification(message, 'error');
}

function showWarning(message) {
    showNotification(message, 'warning');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                animation: slideIn 0.3s ease-out;
                z-index: 9999;
                border-left: 4px solid;
            }
            .notification-error { border-left-color: #ef4444; }
            .notification-warning { border-left-color: #f59e0b; }
            .notification-success { border-left-color: #10b981; }
            .notification-info { border-left-color: #3b82f6; }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                color: #111827;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ============================================
// Utility Functions
// ============================================

// Format phone number for display
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Export for use in other modules (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidZip,
        isKCMetroZip,
        formatPhoneNumber,
        calculateDistance,
        debounce
    };
}
