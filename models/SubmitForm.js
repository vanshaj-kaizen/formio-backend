const db = require('../db'); // mysql2/promise connection

const SubmissionForm = {
    submit: async ({ websiteName, data }) => {
        const normalizedName = websiteName.toLowerCase().replace(/\s+/g, '_');
        const logTable = `${normalizedName}_logs`;

        // 1. Check if website exists in `websites`
        const [rows] = await db.query('SELECT * FROM websites WHERE website_name = ?', [websiteName]);

        if (rows.length === 0) {
            await db.query(
                'INSERT INTO websites (log_table_name, website_name) VALUES (?, ?)',
                [logTable, websiteName]
            );

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
        await db.query(`INSERT INTO ${logTable} (data) VALUES (?)`, [JSON.stringify(data)]);

        // 3. Extract required fields for lead_data
        let fullname = '';
        if (data.first_name && data.last_name) {
            fullname = `${data.first_name} ${data.last_name}`;
        } else if (data.username) {
            fullname = data.username;
        }

        const email = data.email || null;
        const phone = data.phone || null;

        // Convert boolean to string for storage
        const is_verified = data.isverified
            ? 'Verified'
            : 'Not verified';

        const source_web = websiteName;

        // 4. Insert into lead_data table
        await db.query(
            `INSERT INTO lead_data (fullname, email, phone, is_verified, source_web) VALUES (?, ?, ?, ?, ?)`,
            [fullname, email, phone, is_verified, source_web]
        );
    },

    getAllSubmissions: async ({ websiteName }) => {
        const normalizedName = websiteName.toLowerCase().replace(/\s+/g, '_');
        const logTable = `${normalizedName}_logs`;

        const sql = `SELECT * FROM ${logTable} ORDER BY submitted_at DESC`;
        const [rows] = await db.query(sql);
        return rows;
    },

    // Get leads with pagination and filters (string-based is_verified)
    getLeads: async ({ page = 1, limit = 10, source_web, is_verified }) => {
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        let sql = 'SELECT * FROM lead_data WHERE 1';
        const params = [];

        if (source_web) {
            sql += ' AND source_web = ?';
            params.push(source_web);
        }

        if (is_verified) {
            sql += ' AND is_verified = ?';
            params.push(is_verified); // string now: 'Verified' / 'Not verified'
        }

        // Total count for pagination
        const [countRows] = await db.query(sql.replace('*', 'COUNT(*) as total'), params);
        const total = countRows[0].total;

        // Add order and limit/offset
        sql += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await db.query(sql, params);

        return {
            data: rows,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
};

module.exports = SubmissionForm;
