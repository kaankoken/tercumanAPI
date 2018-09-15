const mongoose = require('mongoose');

const productSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    srcLang: { type: mongoose.Schema.Types.Mixed, ref: 'Language', require: true },
    destLang: { type: mongoose.Schema.Types.Mixed, ref: 'Language', require: true},
    translationPrice: { type: Number },
    file: { type: String, require: true },
});

module.exports =  mongoose.model('Product', productSchema);

