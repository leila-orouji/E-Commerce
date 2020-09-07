const { check } = require('express-validator');

class signupValidation {
    handle(){
        return [
            check('email')
            .isEmail()
            .trim()
            .normalizeEmail()
            .withMessage('Email address is empty')
            ,
            check('password')
            .trim()
            .isLength({min: 5, max: 20})
            .withMessage('Password must more than 5 charachters')
            ,
            check('passwordConfirmation')
            .trim()
            .isLength({min: 5, max: 20})
            .withMessage('password Confirmation is not true')            
        ]
    }
}
module.exports = new signupValidation();