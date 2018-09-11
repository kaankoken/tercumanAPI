const mongoose = require('mongoose');
const User =  require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'mail exist'
                });
            } else if (req.body.password !== req.body.confirmPassword) {
                return res.status(409).json({
                    message: 'Password does not match'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const user =  new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: hash,
                    userType: req.body.userType
                });
                user    
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
};

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Mail does not found, user does not exist'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'auth fail'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, 
                        {
                            expiresIn: "1h"
                        } 
                    );
                    return res.status(200).json({
                        message: 'auth successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'auth fail'
                });
            });
        })
        .catch();
};

exports.user_get_all = (req, res, next) => {
    User.find()
        .select('_id name surname email password userType')
        .then(user => {
            var response = {
                count: user.length,
                users: user.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        surname: doc.surname,
                        email: doc.email,
                        password: doc.password,
                        userType: doc.userType,
                        request: {type: 'GET'}
                    }
                })
            }
            res.send(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err:err
            });
        });
};

exports.user_delete_user = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};