const exress = require('express');
const router = exress.Router();
const Product = require('./../../models/product')

router.get('/', async (req,res)=>{
    const title = 'homePage';
    const products = await Product.find({});
    res.render('./home/home.ejs', {title, products});
})

module.exports = router;