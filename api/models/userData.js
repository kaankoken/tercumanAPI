const mongoose = require('mongoose');

const DataModel = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', require: true},
});

module.exports = mongoose.model('userDataModel', DataModel);