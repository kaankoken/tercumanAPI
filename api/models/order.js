const mongoose =  require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.Mixed, ref: 'Product', required: true },
    wordCount: { type: Number, default: 1 },
    totalPrice: {type: Number, default: 1},
    user: { type: mongoose.Schema.Types.Mixed, ref: 'User', required: true}
});

module.exports = mongoose.model('Order', orderSchema);