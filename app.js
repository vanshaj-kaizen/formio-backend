const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const formRoute = require('./routes/form.js');
const submissionRoute = require('./routes/submission.js')

const app = express();

app.use(express.json());

dotenv.config();

app.use(cors())

app.use('/form', formRoute);
app.use('/submission', submissionRoute);
app.route('/',(req,res) => {
    res.send({'mess': 'running'});
})

const PORT = process.env.PORT;



app.listen(PORT, () => {
    console.log('server listening on port: ', PORT);
});
