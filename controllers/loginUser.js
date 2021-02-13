const bcrypt = require('bcrypt')

const User = require('../database/models/User')


module.exports = (req, res) => {


    const { email, password } = req.body
    // try to find the user

    User.findOne({ email }, (error, user) => {

        if(user){

            // Compare Password
            bcrypt.compare(password, user.password, (error, same) => {

                req.session.userId = user._id
                
                if (same){

                    // compare user password
                    res.redirect('/')
                }else{

                    res.redirect('/auth/login')
                }
            })
        } else {
            return res.redirect('/auth/login')
        }
    })
}