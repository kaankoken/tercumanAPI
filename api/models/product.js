const mongoose = require('mongoose');

const productSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sourceLanguage: { type: String, require: true },
    destinationLanguage: { type: String, require: true},
    unitPrice: { type: Number, require: true },
    file: { type: String, require: true },
});

module.exports =  mongoose.model('Product', productSchema);

