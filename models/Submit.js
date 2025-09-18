const db = require('../db');
const Submission = {
    submitById: async ({ formId, data }) => {
        const tableName = `form_${formId}_submissions`;

        const entries = Object.entries(data).filter(([key]) => key !== "submit");

        const columns = entries.map(([key]) => `\`${key}\``).join(", ");
        const values = entries.map(([_, value]) =>{
            if(typeof value == 'object') return JSON.stringify(value);
            else return value;
        });

        const placeholders = entries.map(() => "?").join(", ");

        const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;

        console.log(tableName,columns,values);

        const [result] = await db.query(sql, values);
        return result.insertId;

    },
    getAllSubmissions: async ({formId})=>
    {
        const tableName = `form_${formId}_submissions`;
        const query = `SELECT * from ${tableName}`;
        const [rows] = await db.query(query);
        return rows;
    }
}

module.exports = Submission;