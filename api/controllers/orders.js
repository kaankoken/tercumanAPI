const mongoose = require('mongoose');
const Order = require('../models/order');
const Product  = require('../models/product');
const mammoth =  require('mammoth');
var pdfUtil = require('pdf-to-text');
const fs = require('fs');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('_id product wordCount totalPrice')
        .populate('product')
        .populate('user')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        user: doc.user,
                        product: doc.product,
                        wordCount: doc.wordCount,
                        totalPrice: doc.totalPrice,
                        requests: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_create_order =  (req, res, next) => {
    Product.findById({_id: req.body.productId})
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product Not Found'
                });
            }
            if (product.file.search('.docx') != -1) {
                mammoth.extractRawText({path: __rootdir + '/public/uploads/' + product.file})
                    .then(result => {
                        var text = result.value;
                        text = text.split(' ').length;
                        console.log(text);
                    })
                    .done();
            } else if (product.file.search('.txt') != -1) {
                var text = fs.readFileSync(__rootdir + '/public/uploads/' + product.file, 'utf-8');
                text = text.split(' ').length;
                console.log(text);
            } else if (product.file.search('.pdf')) {
                pdfUtil.pdfToText(__rootdir + '/public/uploads/' + product.file, function(err, text) {
                    if (err) throw(err);
                    text = text.split(' ').length;
                    console.log(text);
                });
            } else {
                res.status(500).json({
                    error: 'unidentifed file'
                });
            }
            const order =  new Order({
                _id: new mongoose.Types.ObjectId(),
                user: req.body.userId,
                product: req.body.productId,
                wordCount: 0,
                totalPrice: 0 * product.translationPrice
            });
            return order.save();    
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    user: result.user,
                    product: result.product,
                    wordCount: result.wordCount,
                    totalPrice: result.totalPrice
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
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

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .populate('user')
        .exec()
        .then(order => {
            if (!order ) {
                return res.status(404).json({
                    message: 'Order Not Found'
                });
            }
            res.status(200).json({
               order: order,
               request: {
                   type: 'GET',
                   url: 'http://localhost:3000/orders/'
               } 
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId;
 
    Order.deleteOne({ _id: id})
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Order has removed',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/',
                    body: { productId: 'ID', wordCount: 'Number', totalPrice: 'Number'}
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
};