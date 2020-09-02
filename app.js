const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));     /// Globally Applying Middleware 

app.get('/', (req, res) => {
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

app.post('/', (req, res) => {
    console.log(req.body)
    res.send('Acount Created!');
});

app.listen(3001, () => {
    console.log('Listening on port 3001');
});