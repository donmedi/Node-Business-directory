const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');
const Category = require('../models/category');



router.get('/', async(req,res,next) =>{
    let searchOptions = {};
    if (req.query.search && req.query.search !== '') {
        searchOptions.name = new RegExp(req.query.search, 'i');
    }
        try {
            const lists = await Listing.find(searchOptions);
            res.render('index',{
                searchOptions: req.query,
                lists: lists,
            })
        } catch {
            res.redirect('/');
            console.log('error log');
        }
    next()
});


// router.get('/', (req,res)=> {
//     Category.find({}, function(err,category){
//         if(err){
//             console.log('error in category');
//         }
//         let model={
//             category: category
//         };
//         res.render('index',model);
//     })
// });



module.exports = router;