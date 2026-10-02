// Base URL of the backend API service
const API_BASE = "http://localhost:8080/api";
// Cache all event data for client-side live filtering
let allEvents = [];

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_BASE}/events/home`);
        if (!response.ok) throw new Error("Server response error");
        
        allEvents = await response.json();
        renderEventList(allEvents);
        initFilters();
        initBackToTop();
    } catch (err) {
        document.querySelector("#eventListHome").innerHTML = 
            '<p class="error-msg">Failed to load events. Please ensure the backend server is running on port 8080.</p>';
        console.error(err);
    }
});

/**
 * Initialize homepage filters and bind change events for status dropdown and price inputs
 * @returns {void}
 */
function initFilters() {
    const statusSelect = document.querySelector("#filterStatus");
    const priceMinInput = document.querySelector("#filterPriceMin");
    const priceMaxInput = document.querySelector("#filterPriceMax");

    statusSelect.addEventListener('change', applyFilters);
    priceMinInput.addEventListener('input', applyFilters);
    priceMaxInput.addEventListener('input', applyFilters);
}

/**
 * Apply selected status and price range filters, then re-render the event list
 * @returns {void}
 */
function applyFilters() {
    const status = document.querySelector("#filterStatus").value;
    const priceMin = parseFloat(document.querySelector("#filterPriceMin").value);
    const priceMax = parseFloat(document.querySelector("#filterPriceMax").value);

    let filtered = [...allEvents];

    // Filter by event status
    if (status === 'upcoming') {
        filtered = filtered.filter(e => new Date(e.event_end_datetime) >= new Date() && !isFullyFunded(e));
    } else if (status === 'past') {
        filtered = filtered.filter(e => new Date(e.event_end_datetime) < new Date() && !isFullyFunded(e));
    } else if (status === 'funded') {
        filtered = filtered.filter(e => isFullyFunded(e));
    }

    // Filter by ticket price range
    // Only apply min filter if a valid number is entered
    if (!isNaN(priceMin)) {
        filtered = filtered.filter(e => e.ticket_price >= priceMin);
    }
    // Only apply max filter if a valid number is entered
    if (!isNaN(priceMax)) {
        filtered = filtered.filter(e => e.ticket_price <= priceMax);
    }

    renderEventList(filtered);
}

/**
 * Check if an event has reached its fundraising goal
 * @param {Object} event - Single event data object
 * @returns {boolean} True if fully funded, false otherwise
 */
function isFullyFunded(event) {
    return parseFloat(event.current_progress) >= parseFloat(event.charity_goal);
}

/**
 * Get the status type identifier of an event
 * @param {Object} event - Single event data object
 * @returns {string} Status code: upcoming / past / funded
 */
function getEventStatus(event) {
    if (isFullyFunded(event)) return 'funded';
    if (new Date(event.event_end_datetime) < new Date()) return 'past';
    return 'upcoming';
}

/**
 * Get the display text for a status code
 * @param {string} status - Status identifier
 * @returns {string} Human-readable status label
 */
function getStatusText(status) {
    switch(status) {
        case 'upcoming': return 'Upcoming';
        case 'past': return 'Past';
        case 'funded': return 'Fully Funded';
        default: return '';
    }
}

/**
 * Render event list cards into the home page container
 * @param {Array<Object>} eventArray - Array of event objects from API
 * @returns {void}
 */
function renderEventList(eventArray) {
    const container = document.querySelector("#eventListHome");
    container.innerHTML = "";

    if (eventArray.length === 0) {
        container.innerHTML = "<p>No events match your filter criteria.</p>";
        return;
    }

    eventArray.forEach(event => {
        const status = getEventStatus(event);
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
            <span class="status-tag status-${status}">${getStatusText(status)}</span>
            <h3>${event.event_name}</h3>
            <p><strong>Category:</strong> ${event.category_name}</p>
            <p><strong>Organiser:</strong> ${event.org_name}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Duration:</strong> ${formatDateTime(event.event_start_datetime)} - ${formatDateTime(event.event_end_datetime)}</p>
            <p><strong>Ticket:</strong> ${event.ticket_price === 0 ? "FREE" : "$" + event.ticket_price}</p>
            <a class="btn" href="event-detail.html?id=${event.event_id}">View Full Details</a>
        `;
        container.appendChild(card);
    });
}

/**
 * Format ISO datetime string into local readable format
 * @param {string} datetimeStr - ISO standard datetime string
 * @returns {string} Formatted local datetime text
 */
function formatDateTime(datetimeStr) {
    return new Date(datetimeStr).toLocaleString();
}

/**
 * Initialize back-to-top button: show/hide on scroll, smooth scroll to top on click
 * @returns {void}
 */
function initBackToTop() {
    const btn = document.querySelector("#btnBackTop");
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
