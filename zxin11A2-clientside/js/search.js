// Base URL of the backend API service
const API_BASE = "http://localhost:8080/api";

window.addEventListener('DOMContentLoaded', async () => {
    // Load category dropdown options on page load
    await loadCategoryOptions();

    const searchForm = document.querySelector("#searchForm");
    const clearButton = document.querySelector("#btnClear");

    // Handle form submission to trigger search
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector("#errorArea").innerHTML = "";
        await executeSearch();
    });

    // Handle clear button click to reset all form fields
    clearButton.addEventListener('click', () => {
        searchForm.reset();
        document.querySelector("#searchResultList").innerHTML = "";
        document.querySelector("#errorArea").innerHTML = "";
    });

    initBackToTop();
});

/**
 * Load all event categories from API and populate the dropdown select element
 * @returns {Promise<void>}
 */
async function loadCategoryOptions() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const categories = await response.json();
        const select = document.querySelector("#selCategory");

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.category_id;
            option.textContent = cat.category_name;
            select.appendChild(option);
        });
    } catch (err) {
        document.querySelector("#errorArea").innerHTML = 
            '<p class="error-msg">Failed to load category list.</p>';
    }
}

/**
 * Collect filter criteria from the form, call search API and render results
 * Date filter acts as "starting from" threshold: returns events on or after the selected date
 * Includes validation for price range inputs
 * @returns {Promise<void>}
 */
async function executeSearch() {
    const dateValue = document.querySelector("#inpDate").value.trim();
    const locationValue = document.querySelector("#inpLocation").value.trim();
    const categoryValue = document.querySelector("#selCategory").value;
    const priceMin = document.querySelector("#inpPriceMin").value.trim();
    const priceMax = document.querySelector("#inpPriceMax").value.trim();

    // Basic validation: min price cannot be greater than max price
    if (priceMin && priceMax && parseFloat(priceMin) > parseFloat(priceMax)) {
        document.querySelector("#errorArea").innerHTML = 
            '<p class="error-msg">Invalid input: minimum price cannot be higher than maximum price.</p>';
        return;
    }

    // Build query parameters - only append non-empty values
    const params = new URLSearchParams();
    if (dateValue) params.append("date", dateValue);
    if (locationValue) params.append("location", locationValue);
    if (categoryValue) params.append("category_id", categoryValue);
    if (priceMin) params.append("price_min", priceMin);
    if (priceMax) params.append("price_max", priceMax);

    // Debug: print final request URL in browser console
    console.log('Search request URL:', `${API_BASE}/events/search?${params.toString()}`);

    try {
        const response = await fetch(`${API_BASE}/events/search?${params.toString()}`);
        if (!response.ok) throw new Error("Search request failed");

        const results = await response.json();
        console.log('Search results:', results); // Debug: print results in console
        renderSearchResults(results);
    } catch (err) {
        document.querySelector("#errorArea").innerHTML = 
            '<p class="error-msg">Search failed. Please try again later.</p>';
        console.error(err);
    }
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
 * Render search result event list into the page container
 * @param {Array<Object>} eventArray - Array of event objects returned by search
 * @returns {void}
 */
function renderSearchResults(eventArray) {
    const container = document.querySelector("#searchResultList");
    container.innerHTML = "";

    if (eventArray.length === 0) {
        container.innerHTML = "<p>No events match your search criteria.</p>";
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
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Duration:</strong> ${formatDateTime(event.event_start_datetime)} - ${formatDateTime(event.event_end_datetime)}</p>
            <p><strong>Ticket:</strong> ${event.ticket_price === 0 ? "FREE" : "$" + event.ticket_price}</p>
            <a class="btn" href="event-detail.html?id=${event.event_id}">View Details</a>
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
