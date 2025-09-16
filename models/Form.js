const db = require('../db');

const Form = {
  create: async ({ name, schema, country, brand }) => {
    const [result] = await db.query(
      "INSERT INTO form_schema (name, form_schema,country,brand) VALUES (?, ?,?,?)",
      [name, JSON.stringify(schema), country, brand]
    );

    const formId = result.insertId;
    const tableName = `form_${formId}_submissions`;

    function mapFormioTypeToMySQL(type) {
      switch (type) {
        case "number": return "INT";
        case "checkbox": return "TINYINT(1)";
        case "date": return "DATE";
        case "datetime": return "DATETIME";
        case "email": return "VARCHAR(255)";
        case "phoneNumber": return "VARCHAR(20)";
        case "textfield":
        case "textarea": return "TEXT";
        case "select": return "TEXT"; // store JSON or CSV
        default: return "TEXT"; // fallback
      }
    }

    const columns = schema.components.map((c) => {
      switch (c.type) {
        case "number": return `\`${c.key}\` INT`;
        case "email":
        case "textfield": return `\`${c.key}\` VARCHAR(255)`;
        default: return `\`${c.key}\` ${mapFormioTypeToMySQL(c.key)}`;
      }
    });

    const createTableSQL = `
    CREATE TABLE ${tableName} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.join(",\n")},
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    console.log(createTableSQL);

    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await db.query("SELECT id,name,country,brand FROM form_schema");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM form_schema WHERE id = ?", [id]);
    return rows[0];
  },

  editById: async ({ id, schema, name, country, brand }) => {
    const [result] = await db.query('UPDATE form_schema SET form_schema = ?, name =?,country=?,brand=? Where id=?', [JSON.stringify(schema), name, country, brand, id]);
    return result;
  },

  deleteById: async ({ id }) => {
    const [result] = await db.query('DELETE from form_schema where id = ?', [id]);

    if (result.affectedRows > 0) {

      console.log("Row deleted successfully");
      return true;  // ✅ success

    } else {

      console.log("No row found with given id");
      return false; // ❌ nothing deleted

    }
  }
};

module.exports = Form;
