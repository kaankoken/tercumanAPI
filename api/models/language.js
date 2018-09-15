const mongoose = require('mongoose');

const LanguageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    language: {type: String, require: true},
    unitPrice: {type: Number, require: true}
});

module.exports = mongoose.model('Language', LanguageSchema);