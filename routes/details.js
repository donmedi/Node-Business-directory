const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');


router.get('/details/:id', function(req, res){
	Listing.findOne({_id: req.params.id}, function(err, list){
		if(err){
			console.log(err);
		}
		var model = {
			list: list
		};
		res.render('details.ejs', model);
	});


	// const reload = location.reload;
	Listing.findOneAndUpdate({_id: req.params.id},{
		$inc: {counter: 1}
	}).exec();


});


module.exports = router;