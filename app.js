const express = require('express');
const Form = require('./models/Form.js');
const cors = require('cors');
const dotenv = require('dotenv');
const formRoute = require('./routes/form.js');

const app = express();

app.use(express.json());

dotenv.config();

app.use(cors())

app.use('/form',formRoute);

const PORT = process.env.PORT;



app.listen(PORT, () => {
    console.log('server listening on port: ', PORT);
});
