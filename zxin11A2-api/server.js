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
              AND e.event_date >= NOW()
            ORDER BY e.event_date ASC
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
 * Search events by optional filter criteria
 * All filters are optional and can be combined freely
 * @route GET /api/events/search
 * @param {string} [req.query.date] - Exact event date in YYYY-MM-DD format
 * @param {string} [req.query.location] - Keyword for fuzzy location search
 * @param {string} [req.query.category_id] - Numeric category ID filter
 * @returns {Array<Object>} List of matched event objects
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

        // Append date filter if provided
        if (req.query.date) {
            baseSql += ' AND DATE(e.event_date) = ? ';
            params.push(req.query.date);
        }
        // Append location fuzzy filter if provided
        if (req.query.location) {
            baseSql += ' AND e.location LIKE ? ';
            params.push(`%${req.query.location}%`);
        }
        // Append category filter if provided
        if (req.query.category_id) {
            baseSql += ' AND e.category_id = ? ';
            params.push(req.query.category_id);
        }

        baseSql += ' ORDER BY e.event_date ASC ';

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
