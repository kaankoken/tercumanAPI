const mongoose =  require('mongoose');

const userRoleSchema =  mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    role: {type: String, require: true}
});

module.exports = mongoose.model('UserRole', userRoleSchema);