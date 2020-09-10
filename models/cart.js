const mongoose = require('mongoose');
const product = require('./product');
const schema = mongoose.Schema;

const cartSchema = new schema({
    product:[schema.Types.Mixed] ,


}, { timestamps: true, toJSON: { virtuals: true } });

cartSchema.virtual('products', {
    ref: 'product',
    localField: '_id',
    foreignField: "cart"
})


module.exports = mongoose.model('cart', cartSchema);