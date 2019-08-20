var mongoose = require('mongoose');
const Joi = require('joi');

var userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, minlength: 5, maxlength: 255},
    password: {type: String, required: true, minlength: 5, maxlength: 1024}
});

const User = mongoose.model('User',userSchema);

// const addUser = new User({
//     username: 'mario',
//     email: 'donmarito5@gmail.com',
//     password: '01234567',
// });

// addUser.save((err,doc)=>{
//     if(err) return console.log(err);
//     console.log(doc);
// });


function validateUser(user){
    const schema={
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user,schema);
}

exports.validate = validateUser;
exports.User = User;