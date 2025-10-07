const express = require('express');
const SubmissionForm = require('../models/SubmitForm.js');
const db = require('../db'); // make sure db is imported here
const router = express.Router();

// Get leads with pagination and filters
router.get('/', async (req, res) => {
    try {
        const { page, limit, source_web, is_verified } = req.query;

        const leads = await SubmissionForm.getLeads({
            page,
            limit,
            source_web,
            is_verified: is_verified === undefined ? undefined : is_verified // string: 'Verified' / 'Not verified'
        });

        res.json(leads);
    } catch (err) {
        console.error('Error fetching leads:', err);
        res.status(500).json({ message: 'Internal server error' });a
    }
});

// Get all websites for dropdown
router.get('/websites', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM websites ORDER BY website_name ASC');
        res.json({ data: rows });
    } catch (err) {
        console.error('Error fetching websites:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
