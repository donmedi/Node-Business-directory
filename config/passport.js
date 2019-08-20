const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {User,validate} = require('../models/user');

    // Local Strategy
module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username, password, done) =>{
            User.findOne({username: username })
                .then(user => {
                    if(!user){
                        return done (null, false, {message: 'invalid username'});
                    }

                 bcrypt.compare(password, user.password,(err,isMatch)=> {
                     if (err) throw err;

                     if (isMatch) {
                         return done(null, user);
                     } else {
                         return done(null, false, {message: 'wrong password'})
                     }
                 });
        })
            .catch(err => console.log(err));
        })
);






            passport.serializeUser(function(user, done) {
                done(null, user.id);
            });

            passport.deserializeUser(function(id, done) {
                User.findById(id, (err,user)=>{
                    done(err, user);
                })
            });
};
