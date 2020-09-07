const exress = require('express');
const router = exress.Router();
const User = require('./../../models/user');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const util = require('util');  //promissifier

const scrypt = util.promisify(crypto.scrypt);  // change scrypt to a promiss function then use it as an await / async function


//Validators
const signupValidator = require('./../../validator/signupValidator');
const signinValidator = require('./../../validator/signinValidator');
const user = require('./../../models/user');
//Router

router.get('/signup', async (req, res) => {
    const title = 'sign Up '
    res.render('./admin/signup.ejs', { title, messages: req.flash('error') });
});

//BODY PARSER

// const bodyParser = (req, res, next) => {
//     if (req.method === 'POST') {
//         req.on('data', (data) => {
//             // Parsing Form Data

//             const parsed = data.toString('utf8').split('&');
//             const formData = {};
//             for (let pair of parsed) {
//                 const [key, val] = pair.split('=');
//                 formData[key] = val;
//             }
//             req.body = formData;
//             next();
//         })
//     }
//     else {
//         next();
//     }
// }


//  without globaly applying Middleware     :     pp.post('/',bodyParser.urlencoded({extended : true}), (req, res) =>

router.post('/signup', signupValidator.handle(), async (req, res) => {
    if (validationResult) {
        const errors = validationResult(req).array();
        let messageError = [];
        for (const element of errors) {
            messageError.push(element.msg)
        }
        if (messageError.length > 0) {
            req.flash('error', messageError)
            res.redirect('/signup')
        }

    }
    const { email, password, passwordConfirmation } = req.body;

    if (password !== passwordConfirmation) {
        req.flash('error', 'Password must match!');
        return res.redirect('/signup')
    }
    const sameEmail = await User.findOne({ email });
    if (sameEmail) {
        req.flash('error', 'Email in use');
        return res.redirect('/signup')
    }
    const salt = crypto.randomBytes(8).toString('hex');
    const hashed = await scrypt(password, salt, 64);
    const newUser = new User({
        email,
        password: `${hashed.toString('hex')}.${salt}`
    })
    // .save is for saving in robomongo
    await newUser.save((err) => {
        if (err) throw err
    });
    req.session.userId = newUser._id;
    res.redirect('/signin');
});

router.get('/signout', (req, res, next) => {
    req.session = null;
    res.redirect('/');
})

router.get('/signin', (req, res, next) => {
    const title = 'Sign In';
    res.render('./admin/signin.ejs', { title, messages: req.flash('error') });
});

router.post('/signin', signinValidator.handle(), async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length>0) {
        
        let messageError = [];
        for (const element of errors) 
            messageError.push(element.msg)
        if (messageError.length > 0) {
            req.flash('error', messageError)
            res.redirect('/signin')
        }
    }
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        req.flash('error', 'User not find');
        return res.redirect('/signin');
    }
    const [hashed, salt] = findUser.password.split('.');
    const hashedCurrentPass = await scrypt(password, salt, 64);
    if (hashedCurrentPass.toString('hex') !== hashed) {
        req.flash('error', 'password is not match!');
        return res.redirect('/signin')
    }
    if(!req.session.userId){
        req.session.userId = findUser._id;
    }
    res.redirect('/admin/products');
});

module.exports = router;