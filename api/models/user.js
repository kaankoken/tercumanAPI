const mongoose =  require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },
    surname: {type: String, require: true },
    email: { 
        type: String, 
        require: true, 
        unique: true, 
        match:  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    password: { type: String, require: true },
    confirmPassword: { type: String, require: true},
    userType: {type: mongoose.Schema.Types.Mixed, ref: 'UserRole'}
});

module.exports =  mongoose.model('User', userSchema);