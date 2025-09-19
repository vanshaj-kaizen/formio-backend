const express = require('express');
const route = express.Router();
const Form = require('../models/Form')

route.post('/create', async (req, res) => {
    try {
        const { name, schema, country, brand } = req.body;
        await Form.create({ name, schema, country, brand });
        res.send({ message: "completed" })
    }
    catch (e) {
        res.status(500)
        console.log(e);
    }
})

route.get('/all', async (req, res) => {

    try {
        const data = await Form.findAll();
        res.send(data);
    }
    catch (e) {
        res.status(500)
        console.log(e)
    }
})
route.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const form = await Form.findById(id);

        res.send(form);
    }
    catch (e) {
        res.status(500)
        console.log(e);
    }
})

route.put('/edit', async (req, res) => {
    try {
        const { id, name, brand, country, schema } = req.body;
        const result = await Form.editById({ id, name, brand, country, schema });
        if (result.affectedRows > 0 && result.changedRows > 0) {
            res.send({ message: 'updated successfully' });
        }
        else {
            res.status(400)
        }
    }
    catch (e) {
        console.log(e);
        res.status(500);
    }
})

route.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const isDeleted = await Form.deleteById({ id });
        if (isDeleted) {
            res.send({ message: 'Deleted successfully' });
        }
        else{
            res.status(400).send({ message: 'Unable to delete' })
        }
    }
    catch (e) {
        console.log(e);
        res.status(500);
    }
})

module.exports = route;