const express = require('express');
const Submission = require('../models/Submit');
const submissionRoute = express.Router();

submissionRoute.post('/',async (req,res) => {
    const {formId,data} = req.body;
    try{
        await Submission.submitById({formId,data});
        res.send({"message": "submission complete"});
    }
    catch(e)
    {
        res.status(500);
        console.log('catching error',e);
    }
})  
submissionRoute.get('/all/:id',async (req,res) => {
    const id = req.params.id;
    console.log('requrest reccieved')
    try{
        const rows = await Submission.getAllSubmissions({formId:id});
        res.send(rows);
    }
    catch(e)
    {
        res.status(500);
        console.log(' error',e);
    }
})

module.exports = submissionRoute;
