const mongoose =  require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.Mixed, ref: 'Product', required: true },
    wordCount: { type: Number, default: 1 }, //dosya açma ve kelime saydırmaya bakılacak
    totalPrice: {type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);