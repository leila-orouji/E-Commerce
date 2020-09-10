const mongoose = require('mongoose');


const schema = mongoose.Schema;

const productSchema = new schema({
    cart: {type: schema.Types.ObjectId , ref:'cart'},
    title : { type: String, required: true},
    price: { type: Number, default: 0 },
    image: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema);