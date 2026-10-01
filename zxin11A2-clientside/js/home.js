const API_BASE = "http://localhost:8080/api";

// Load events when page DOM is ready
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_BASE}/events/home`);
        if (!response.ok) throw new Error("Server error");
        
        const events = await response.json();
        renderEventList(events);
    } catch (err) {
        document.querySelector("#eventListHome").innerHTML = 
            '<p class="error-msg">Failed to load events. Please ensure the backend server is running.</p>';
        console.error(err);
    }
});
/**
 * Render event list cards into the home page container
 * @param {Array<Object>} eventArray - Array of event objects from API
 * @returns {void}
 */
function renderEventList(eventArray) {
    const container = document.querySelector("#eventListHome");
    container.innerHTML = "";

    // Handle empty state
    if (eventArray.length === 0) {
        container.innerHTML = "<p>No upcoming charity events available at the moment.</p>";
        return;
    }

    // Create and append a card for each event
    eventArray.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
            <h3>${event.event_name}</h3>
            <p><strong>Category:</strong> ${event.category_name}</p>
            <p><strong>Organiser:</strong> ${event.org_name}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Date & Time:</strong> ${new Date(event.event_date).toLocaleString()}</p>
            <p><strong>Ticket:</strong> ${event.ticket_price === 0 ? "FREE" : "$" + event.ticket_price}</p>
            <a class="btn" href="event-detail.html?id=${event.event_id}">View Full Details</a>
        `;
        container.appendChild(card);
    });
}
