const express = require('express');
const { validationResult } = require('express-validator');
const fs = require('fs');

const Product = require('./../../models/product');
const productValidator = require('./../../validator/productValidator')

const router = express.Router();
const upload = require('./../../helpers/uploadImage');
const fileToField = require('./../../validator/fileToField')
const redirectIfNoAdmin = require('./../../validator/redirectIfNoAdmin');
const { error } = require('console');


router.get('/admin/products', redirectIfNoAdmin.handle, async (req, res) => {
    let title = 'Product List';

    let products = await Product.find({});
    res.render('./admin/products.ejs', { products })
})

router.get('/admin/products/newProduct',redirectIfNoAdmin.handle , (req, res) => {
    res.render('./admin/NewProduct.ejs', { title: 'Creat new product', messages: req.flash('info') })
})

router.post('/admin/products/newProduct',redirectIfNoAdmin.handle, upload.single('image'), fileToField.handle, productValidator.handle() , async (req, res) => {
    // return res.json(req.file)
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        let messageError = [];
        for (const element of errors)
            messageError.push(element.msg)
        req.flash('info', messageError);
        res.redirect('/admin/products/newProduct');
        if (req.file) {
            fs.unlink(req.file.path, (err) => { console.log('Image file not deleted') });
        }
    }
    const image = `${req.file.destination.substring(8)}/${req.file.originalname}`;
    // const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    const newProduct = new Product({ title, price, image });
    await newProduct.save();
    res.redirect('/admin/products');
})
router.get('/admin/products/:id/edit', redirectIfNoAdmin.handle , async (req, res, next) => {
    const typicalProduct = await Product.findById(req.params.id);
    const title = 'Edit product';

    res.render('./admin/editProduct.ejs', { title, typicalProduct, messages: req.flash('info') });
})

router.post(
    '/admin/products/:id/edit',
    redirectIfNoAdmin.handle,
    upload.single('image'),
    fileToField.handle,
    productValidator.handle(),
    async (req, res, next) => {
        console.log(req.body)
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            let messageError = [];
            for (const element of errors)
                messageError.push(element.msg)
            req.flash('info', messageError);
            res.redirect(`/admin/products/${req.params.id}/edit`);
            if (req.file) {
                fs.unlink(req.file.path, (err) => { console.log('Image file not deleted') });
            }
        }
        const image = `${req.file.destination.substring(8)}/${req.file.originalname}`;
        const {title, price} = req.body;
        await Product.findByIdAndUpdate(req.params.id, {
            title,price,image });
        res.redirect('/admin/products');
    })

    router.get('/admin/products/:id/delete', redirectIfNoAdmin.handle , async (req, res, next) => {
        await Product.findByIdAndDelete (req.params.id);    
        res.redirect("/admin/products")
    })

module.exports = router;