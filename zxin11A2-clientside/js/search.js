const API_BASE = "http://localhost:8080/api";

window.addEventListener('DOMContentLoaded', async () => {
    // Load category dropdown options
    await loadCategoryOptions();

    const searchForm = document.querySelector("#searchForm");
    const clearButton = document.querySelector("#btnClear");

    // Form submit handler
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector("#errorArea").innerHTML = "";
        await executeSearch();
    });

    // Clear Filters button - reset all form fields (DOM manipulation)
    clearButton.addEventListener('click', () => {
        searchForm.reset();
        document.querySelector("#searchResultList").innerHTML = "";
        document.querySelector("#errorArea").innerHTML = "";
    });
});
/**
 * Fetch all event categories from API and fill the dropdown select
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
 * Build query parameters from form inputs and execute search request
 * @returns {Promise<void>}
 */
async function executeSearch() {
    const dateValue = document.querySelector("#inpDate").value.trim();
    const locationValue = document.querySelector("#inpLocation").value.trim();
    const categoryValue = document.querySelector("#selCategory").value;

    // Build query parameters
    const params = new URLSearchParams();
    if (dateValue) params.append("date", dateValue);
    if (locationValue) params.append("location", locationValue);
    if (categoryValue) params.append("category_id", categoryValue);

    try {
        const response = await fetch(`${API_BASE}/events/search?${params.toString()}`);
        if (!response.ok) throw new Error("Search request failed");

        const results = await response.json();
        renderSearchResults(results);
    } catch (err) {
        document.querySelector("#errorArea").innerHTML = 
            '<p class="error-msg">Search failed. Please try again later.</p>';
        console.error(err);
    }
}
/**
 * Render search result cards into the page container
 * @param {Array<Object>} eventArray - Array of matched event objects
 * @returns {void}
 */
function renderSearchResults(eventArray) {
    const container = document.querySelector("#searchResultList");
    container.innerHTML = "";

    // Handle no matching results
    if (eventArray.length === 0) {
        container.innerHTML = "<p>No events match your search criteria.</p>";
        return;
    }

    // Create card for each result
    eventArray.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
            <h3>${event.event_name}</h3>
            <p><strong>Category:</strong> ${event.category_name}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
            <p><strong>Ticket:</strong> ${event.ticket_price === 0 ? "FREE" : "$" + event.ticket_price}</p>
            <a class="btn" href="event-detail.html?id=${event.event_id}">View Details</a>
        `;
        container.appendChild(card);
    });
}
