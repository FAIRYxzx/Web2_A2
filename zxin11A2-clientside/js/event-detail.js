const API_BASE = "http://localhost:8080/api";

window.addEventListener('DOMContentLoaded', async () => {
    // Get event ID from URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    if (!eventId) {
        document.querySelector("#errorDetail").innerHTML = 
            '<p class="error-msg">Missing event ID in URL. Please return to the home page.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/events/${eventId}`);
        if (!response.ok) throw new Error("Event not found");

        const event = await response.json();
        renderEventDetail(event);
    } catch (err) {
        document.querySelector("#errorDetail").innerHTML = 
            '<p class="error-msg">Could not load event details. Please try again later.</p>';
        console.error(err);
    }
});

/**
 * Render full event details into the page and bind register button
 * @param {Object} event - Full event data object from API
 * @returns {void}
 */
function renderEventDetail(event) {
    const container = document.querySelector("#detailContainer");

    // Calculate fundraising progress percentage
    const progressPercent = Math.min(100, Math.round((event.current_progress / event.charity_goal) * 100));

    container.innerHTML = `
        <div class="detail-block">
            <h1>${event.event_name}</h1>
            <p><strong>Organised by:</strong> ${event.org_name}</p>
            <p><strong>Category:</strong> ${event.category_name}</p>
            <p><strong>Date & Time:</strong> ${new Date(event.event_date).toLocaleString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            
            <hr>
            <h3>Event Purpose</h3>
            <p>${event.event_purpose}</p>
            
            <hr>
            <h3>Full Description</h3>
            <p>${event.event_description}</p>
            
            <hr>
            <h3>Ticket Information</h3>
            <p><strong>Price:</strong> ${event.ticket_price === 0 ? "FREE entry" : "$" + event.ticket_price + " per person"}</p>
            
            <hr>
            <h3>Fundraising Goal vs Progress</h3>
            <p>Goal: $${event.charity_goal.toFixed(2)} &nbsp;|&nbsp; Raised so far: $${event.current_progress.toFixed(2)} (${progressPercent}%)</p>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
            
            <br>
            <button class="btn" id="btnRegister">Register Now</button>
        </div>
    `;

    // Register button - show alert as required (feature under construction)
    document.querySelector("#btnRegister").addEventListener('click', () => {
        alert("This feature is currently under construction.");
    });
}
