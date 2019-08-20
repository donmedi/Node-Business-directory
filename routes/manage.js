const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Listing = require('../models/listing');
const Category = require('../models/category');
const {User,validate} = require('../models/user');

const bcrypt = require("bcrypt");
const passport = require('passport');
// const jwt = require("jsonwebtoken");




router.get('/manage',(req,res) =>{
    res.render('manage/adminLogin');
});

//register route
router.post("/manage", async (req, res)=> {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');


    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        
    await user.save();
    res.send(user);
        console.log(salt);
        console.log(hashedPassword);
    } catch{
        res.status(500).send();
    }
  
});

//login route
// router.post('/manage/login', async (req,res) => {
    // const { error } = validateLogin(req.body);
    // if (error) return res.status(400).send(error.details[0].message);


    // let user = await User.findOne({username: req.body.username})
    // if (!user) return res.status(400).send('invalid email or password');
    // // req.flash('userError','wrong user');
    // res.redirect('/manage/login')
 
    
    // const validPassword = await bcrypt.compare(req.body.password, user.password);
    // if(!validPassword) return res.status(400).send('invalid email or password'); 
    // // req.flash('passError','wrong password');
    // res.redirect('/manage/login')   
    // res.redirect('/manage/index');
// }) 

// passport config
router.post('/manage/login',function (req,res,next){
    passport.authenticate('local',{
    successRedirect:'/manage/index',
    failureRedirect:'/manage/',
    failureFlash: true
    })(req,res,next);
});

router.get('/manage/logout', (req,res)=>{
    req.logout();
    req.flash('Logout_msg','you are now logged out');
    res.redirect('/manage/index');
});







function validateLogin(req){
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}





//manage index page
router.get('/manage/index', checkAuthentication, (req,res)=>{
    res.render('manage/index')
});


// List page
router.get('/manage/list',checkAuthentication,(req,res) =>{
    Listing.find({},(err,lists)=> {
        if(err){
            console.log(err);
        }
        let model = {
            lists: lists
        };
        res.render('manage/list/index', model);
    });
});

router.get('/manage/list/add',checkAuthentication,(req,res) =>{
    Category.find({}, function(err,categories){
        if(err){
            console.log(err);
        }
        var model = {
            categories: categories
        }
        res.render('manage/list/add',model);
    });
});

router.post('/manage/list',checkAuthentication,(req,res)=>{
    var name = req.body.name && req.body.name.trim();
    var description = req.body.description && req.body.description.trim();
    var address = req.body.address && req.body.address.trim();
    var contact_email = req.body.contact_email && req.body.contact_email.trim();
    var phone = req.body.phone && req.body.phone.trim();
    var website_url = req.body.website_url && req.body.website_url.trim();
    var category = req.body.category && req.body.category;

    var newList = new Listing({
        name: name,
        description: description,
        website_url: website_url,
        contact_email: contact_email,
        address: address,
        category: category,
        phone: phone,
    });
    
    newList.save(function(err){
        if(err) {
            console.log('save error', err);
        }
        console.log(newList);
        // req.flash('success', "List Added");
        res.location('/manage/list');
        res.redirect('/manage/list');
    });
});

//edit list
router.post('/manage/list/edit/:id',checkAuthentication,(req,res)=>{
    var name = req.body.name && req.body.name.trim();
    var description = req.body.description && req.body.description.trim();
    var address = req.body.address && req.body.address.trim();
    var contact_email = req.body.contact_email && req.body.contact_email.trim();
    var phone = req.body.phone && req.body.phone.trim();
    var website_url = req.body.website_url && req.body.website_url.trim();
    var category = req.body.category && req.body.category.toString();

    // if (name == '' || category == []){
    //     req.flash('error', 'please fill out requires fields');
    //     res.location('/manage/list/add');
    //     res.redirect('/manage/list/add');
    // }
     
    Listing.update({_id: req.params.id},{
        name: name,
        description: description,
        website_url: website_url,
        contact_email: contact_email,
        address: address,
        category: category,
        phone: phone,
    },
        function(err) {
            if(err){
            console.log('save error', err);
        }
        // req.flash('success', "List Added");
        res.location('/manage/list');
        res.redirect('/manage/list');
    });
});

// delete list
router.post('/manage/list/delete/:id',checkAuthentication, function (req, res) {
    Listing.remove({_id: req.params.id}, function (err) {
        if (err) {
            console.log(err);
        }
        // req.flash('success', "Book Deleted");
        res.location('/manage/list');
        res.redirect('/manage/list');
    });
});


// edit list
router.get('/manage/list/edit/:id',checkAuthentication, function(req, res){
    Category.find({},function (err,categories){
        Listing.findOne({_id: req.params.id}, function(err, list){
            if(err){
                console.log(err);
            }
            var model = {
                list: list,
                categories: categories
            };
            res.render('manage/list/edit',model);
        });
    })

});


// display categories index
router.get('/manage/categories',checkAuthentication,(req,res) =>{
    Category.find({}, (err,categories)=>{
        if(err){
            console.log(err)
        }
        var model = {
            categories: categories
        }
        res.render('manage/categories/index', model);
    })  
});

// goto add categories
router.get('/manage/categories/add',checkAuthentication,(req,res) =>{
    Category.find({}, function(err,categories){
        if(err){
            console.log(err);
        }
        var model = {
            categories: categories
        }
        res.render('manage/categories/add',model);
    });
});

// add categories
router.post('/manage/categories',checkAuthentication,(req,res)=>{
    var name = req.body.name && req.body.name.trim();
    
    // if (name == '' || category == []){
    //     req.flash('error', 'please fill out requires fields');
    //     res.location('/manage/list/add');
    //     res.redirect('/manage/list/add');
    // }
    var newCategory = new Category({
        name: name,
    });
    
    newCategory.save(function(err){
        if(err) {
            console.log('save error', err);
        }
        console.log(newCategory);
        // req.flash('success', "List Added");
        res.location('/manage/categories');
        res.redirect('/manage/categories');
    });
    
});
//edit category
router.get('/manage/categories/edit/:id',checkAuthentication,(req,res) =>{
    Category.findOne({_id: req.params.id},(err,categories)=>{
        if(err){
            console.log(err)
        };
        var model = {
            categories: categories
        };
        res.render('manage/categories/edit',model);
    });
});

router.post('/manage/categories/edit/:id',checkAuthentication,(req,res)=>{
    var name = req.body.name && req.body.name.trim();
    if (name == '' || category == []){
        req.flash('error_category', 'please fill out requires fields');
        res.location('/manage/list/add');
        res.redirect('/manage/list/add');
    }

    Category.update({_id: req.params.id},{
            name: name,

        },
        function(err) {
            if(err){
                console.log('save error', err);
            }
            // req.flash('success', "List Added");
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        });
    });

//delete category
router.post('/manage/categories/delete/:id',checkAuthentication, function (req, res) {
    Category.remove({_id: req.params.id}, function (err) {
        if (err) {
            console.log(err);
        }
        // req.flash('success', "Category Deleted");
        res.location('/manage/categories');
        res.redirect('/manage/categories');
    });
});



function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('login_msg', 'Login to continue');
    res.redirect('/manage');
}



module.exports = router;