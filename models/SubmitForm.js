const db = require('../db'); // mysql2/promise connection

const SubmissionForm = {
    submit: async ({ websiteName, data }) => {
        // Normalize website name for table creation
        const normalizedName = websiteName.toLowerCase().replace(/\s+/g, '_');
        const logTable = `${normalizedName}_logs`;

        // 1. Check if website exists in `websites`
        const [rows] = await db.query('SELECT * FROM websites WHERE website_name = ?', [websiteName]);

        if (rows.length === 0) {
            // Insert new website
            await db.query(
                'INSERT INTO websites (log_table_name, website_name) VALUES (?, ?)',
                [logTable, websiteName]
            );

            // Create new log table dynamically
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS ${logTable} (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    data JSON NOT NULL,
                    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            await db.query(createTableSQL);
        }

        // 2. Insert JSON data into log table
        const insertSQL = `INSERT INTO ${logTable} (data) VALUES (?)`;
        await db.query(insertSQL, [JSON.stringify(data)]);
    },

    getAllSubmissions: async ({ websiteName }) => {
        const normalizedName = websiteName.toLowerCase().replace(/\s+/g, '_');
        const logTable = `${normalizedName}_logs`;

        const sql = `SELECT * FROM ${logTable} ORDER BY submitted_at DESC`;
        const [rows] = await db.query(sql);
        return rows;
    }
};

module.exports = SubmissionForm;
