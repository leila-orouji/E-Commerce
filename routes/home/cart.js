const express = require('express');
const router = express.Router();
const Product = require('./../../models/product');
const Cart = require('./../../models/cart');

const cart = require('./../../models/cart');


router.post('/cart/products', async (req, res, next) => {
    let cart;
    if (!req.session.cartId) {
        let productId = req.body.productId;
        const cart = new Cart({})
        let count = 1;
        cart.product = [{ productId, count }]
        await cart.save();
        req.session.cartId = cart.id;
        return res.redirect('/')
    } else {
        cart = await Cart.findById(req.session.cartId)
    }
    console.log(cart)
    let existinProd = cart.product.find(prod => prod.productId === req.body.productId)

    if (existinProd) {

        existinProd.count++;
    }
    else {
        cart.product.push({ productId: req.body.productId, count: 1 })
    }
    await Cart.findByIdAndUpdate(cart.id, {
        product: cart.product
    })
    res.redirect('/')
})

router.get('/cart', async (req, res, next) => {
    const title = 'Cart'
    if (!req.session.cartId)
        return res.redirect('/');
    const customerBill = await Cart.findById(req.session.cartId);
    let index = 0;
    for (const element of customerBill.product) {

        const item = await Product.findById(element.productId);
        element.product = item;
        // Show_bill(item.title, element.product[index , 1] , item.price, )
        // index ++;
    }
    const total = customerBill.product.reduce((prev, item) => {
        return prev + item.count * item.product.price;
    }, 0);

    return res.render('./home/cart.ejs', { customerBill, title, total })
})

router.post('/cart/delete', async (req, res, next) => {
   
    const { productId } = req.body;
    console.log(productId)
    const cart = await Cart.findById(req.session.cartId);
    const item = cart.product.filter(item => item.productId !== productId)   // if return False then add the item to items
    await Cart.findByIdAndUpdate(cart._id , {product : item});
    res.redirect('/cart')
})
module.exports = router;