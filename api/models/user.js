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
    userType: { 
        generalUser: {type: Boolean},
        translatorUser: {type: Boolean},
        admin: {type: Boolean}
    }
});

module.exports =  mongoose.model('User', userSchema);