const mongoose = require('mongoose');
const userDataModel = require('../models/userData');
const User = require('../models/user');
const Order = require('../models/order');

exports.post = (req, res, next) => {
    User.findById(req.body.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            return Order.findById(req.body.orderId).exec();
        })
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            const users = new userDataModel({
               _id: req.body.userId,
               order: req.body.orderId
            });
            return users.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User Details',
                userDetails: {
                    _id: result._id,
                    order: result.order
                },
                request: {
                    type: 'GET'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_all = (req, res, next) => {
    userDataModel
        .find()
        .populate('_id')
        .populate({
            path: 'order',
            populate: { 
                path: 'product'
            }
        })
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                userDetails: docs.map(doc => {
                    return {
                        _id: doc._id,
                        order: doc.order,
                        request: {
                            type: 'GET'
                        },
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};