// Base URL of the backend API service
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
        initBackToTop();
    } catch (err) {
        document.querySelector("#errorDetail").innerHTML = 
            '<p class="error-msg">Could not load event details. Please try again later.</p>';
        console.error(err);
    }
});

/**
 * Render full details of a single event into the page container
 * @param {Object} event - Full event detail data object
 * @returns {void}
 */
function renderEventDetail(event) {
    const container = document.querySelector("#detailContainer");
    const progressPercent = Math.min(100, Math.round((event.current_progress / event.charity_goal) * 100));

    container.innerHTML = `
        <div class="detail-block">
            <h1>${event.event_name}</h1>
            <p><strong>Organised by:</strong> ${event.org_name}</p>
            <p><strong>Category:</strong> ${event.category_name}</p>
            <p><strong>Duration:</strong> ${formatDateTime(event.event_start_datetime)} - ${formatDateTime(event.event_end_datetime)}</p>
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

    // Register button click handler
    document.querySelector("#btnRegister").addEventListener('click', () => {
        alert("This feature is currently under construction.");
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
