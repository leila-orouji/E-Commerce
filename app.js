const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const home = require('./routes/home/home');
const authRouter = require('./routes/admin/auth');
const products = require('./routes/admin/products');

//Set config mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/e-commerce', { useNewUrlParser: true });


app.set('views');


//Config Express
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));     /// Globally Applying Middleware 
app.use(flash());
app.use(cookieSession({
    keys: ['sdhcfuficheifcj##997.)hghdhc']
}));

app.use(authRouter);
app.use(home);
app.use(products);



app.listen(3001, () => {
    console.log('Listening on port 3001');
});