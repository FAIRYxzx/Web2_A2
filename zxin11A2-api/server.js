/**
 * Charity Events RESTful API Server
 * Built with Express.js, provides all GET endpoints for the client-side website
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./event_db');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());


// API Endpoints

/**
 * Get all active & upcoming events for the home page
 * Filters out suspended events and past events, sorted by date ascending
 * @route GET /api/events/home
 * @returns {Array<Object>} List of event objects with category and organisation info
 */
app.get('/api/events/home', async (req, res) => {
    try {
        const sql = `
            SELECT 
                e.*, 
                c.category_name, 
                o.org_name
            FROM charity_events e
            INNER JOIN event_categories c 
                ON e.category_id = c.category_id
            INNER JOIN charity_organisations o 
                ON e.org_id = o.org_id
            WHERE e.is_suspended = 0 
            ORDER BY e.event_start_datetime ASC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        console.error('Home events error:', err);
        res.status(500).json({ error: 'Failed to fetch home page events' });
    }
});

/**
 * Get all event categories for the search page dropdown
 * @route GET /api/categories
 * @returns {Array<Object>} List of category objects (category_id, category_name)
 */
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM event_categories ORDER BY category_name');
        res.json(rows);
    } catch (err) {
        console.error('Categories error:', err);
        res.status(500).json({ error: 'Failed to load event categories' });
    }
});

/**
 * Event search endpoint: filter by start date (on or after), location, category and price range
 * @route GET /api/events/search
 * @param {string} req.query.date - Minimum start date (YYYY-MM-DD), returns events starting on or after this date
 * @param {string} req.query.location - Location keyword
 * @param {number} req.query.category_id - Category ID
 * @param {number} req.query.price_min - Minimum ticket price
 * @param {number} req.query.price_max - Maximum ticket price
 * @returns {Array<Object>} JSON array of matching events
 */
app.get('/api/events/search', async (req, res) => {
    try {
        let baseSql = `
            SELECT 
                e.*, 
                c.category_name, 
                o.org_name
            FROM charity_events e
            INNER JOIN event_categories c 
                ON e.category_id = c.category_id
            INNER JOIN charity_organisations o 
                ON e.org_id = o.org_id
            WHERE e.is_suspended = 0
        `;
        const params = [];

        // Append filters dynamically
        // Fix: date input acts as "start from" threshold, not exact day match
        if (req.query.date && req.query.date.trim() !== '') {
            baseSql += ' AND e.event_start_datetime >= ? ';
            params.push(`${req.query.date} 00:00:00`);
        }
        if (req.query.location && req.query.location.trim() !== '') {
            baseSql += ' AND e.location LIKE ? ';
            params.push(`%${req.query.location}%`);
        }
        if (req.query.category_id && req.query.category_id !== '') {
            baseSql += ' AND e.category_id = ? ';
            params.push(req.query.category_id);
        }
        if (req.query.price_min !== undefined && req.query.price_min !== '') {
            baseSql += ' AND e.ticket_price >= ? ';
            params.push(req.query.price_min);
        }
        if (req.query.price_max !== undefined && req.query.price_max !== '') {
            baseSql += ' AND e.ticket_price <= ? ';
            params.push(req.query.price_max);
        }

        baseSql += ' ORDER BY e.event_start_datetime ASC ';

        // Debug log: print final SQL and params in console
        console.log('Search SQL:', baseSql);
        console.log('Search params:', params);

        const [rows] = await db.query(baseSql, params);
        res.json(rows);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Event search failed' });
    }
});


/**
 * Get full details of a single event by its ID
 * @route GET /api/events/:eventId
 * @param {string} req.params.eventId - Unique numeric ID of the event
 * @returns {Object} Full event object with category and full organisation details
 */
app.get('/api/events/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const sql = `
            SELECT 
                e.*, 
                c.category_name, 
                o.org_name, 
                o.mission, 
                o.contact_email, 
                o.contact_phone, 
                o.address
            FROM charity_events e
            INNER JOIN event_categories c 
                ON e.category_id = c.category_id
            INNER JOIN charity_organisations o 
                ON e.org_id = o.org_id
            WHERE e.event_id = ?
        `;
        const [rows] = await db.query(sql, [eventId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Event detail error:', err);
        res.status(500).json({ error: 'Failed to load event details' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});
