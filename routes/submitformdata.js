const express = require('express');
const SubmissionForm = require('../models/SubmitForm.js');
const submissionRouteForm = express.Router();

submissionRouteForm.post('/', async (req, res) => {
    const { websiteName, data } = req.body;

    if (!websiteName || !data) {
        return res.status(400).json({ message: "Missing websiteName or data" });
    }

    try {
        await SubmissionForm.submit({ websiteName, data });
        res.json({ message: "Submission complete" });
    } catch (e) {
        console.error('Submission error:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = submissionRouteForm;
