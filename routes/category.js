const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');
const Category = require('../models/category');


router.get('./index', (req,res)=> {
    Category.find({}, function(err,category){
        if(err){
            console.log('error in category');
        }
        model={
            category: category
        };
        res.render('/partials/category',model);
    })
});



module.exports = router;