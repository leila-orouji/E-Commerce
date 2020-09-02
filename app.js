

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const crypto = require('crypto');
const util = require('util');  //promissifier

const scrypt = util.promisify(crypto.scrypt);  // change scrypt to a promiss function then use it as an await / async function

const User = require('./models/user.js');
//Set config mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/e-commerce', { useNewUrlParser: true });


//Config Express
app.use(bodyParser.urlencoded({ extended: true }));     /// Globally Applying Middleware 
app.use(cookieSession({
    keys: ['sdhcfuficheifcj##997.)hghdhc']
}));

//Router
app.get('/signup', async (req, res) => {
    const oldUsers = await User.find({});
    res.send(`
    <div>
         <form method="POST">
              <input name="email" type="email" placeholder="email"/>
              <input name="password" type="password" placeholder="password"/>
              <input name="passwordConfirmation" type="password" placeholder="password confirmation"/>
              <button>Sign Up</button>
          </form>
    </div>
    `);

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

app.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    if (password !== passwordConfirmation) {
        return res.send('Password must match!');
    }

    const sameEmail = await User.findOne({ email });
    if (sameEmail) {
        return res.send('Email in use')
    }

    const salt = crypto.randomBytes(8).toString('hex');

    const hashed = await scrypt(password, salt, 64);
    const newUser = new User({
        email,
        password: `${hashed.toString('hex')}.${salt}`
    })

    await newUser.save((err) => {
        if (err) throw err
    });
    req.session = newUser._id;
    res.send('Acount Created!');
});

app.get('/signout', (req, res, next) => {
    req.session = null;
    res.send('Logged out');
})

app.get('/signin', (req, res, next) => {
    res.send(`
    <div>
    <form method="POST">
         <input name="email" type="email" placeholder="email"/>
         <input name="password" type="password" placeholder="password"/>
         <button>Sign in</button>
    </form>
    </div>
    `)
});

app.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
        return res.send(' Email NOt Found');
    }
    const [hashed, salt] = findUser.password.split('.');

    const hashedCurrentPass = await scrypt(password, salt, 64);

    if (hashedCurrentPass.toString('hex') !== hashed) {
        return res.send(' Invalid Password!');
    }
    res.send(`Welcome ${email}`);
});
app.listen(3001, () => {
    console.log('Listening on port 3001');
});