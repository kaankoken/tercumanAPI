const mongoose = require('mongoose');

const Product = require('../models/product');
const fs =  require('fs');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count:docs.length,
                products: docs.map(doc => {
                    return  {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From database " + doc);
            if (doc) {
                res.status(200).json({
                    product: doc, 
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                });
            } else {
                res.status(404).json({message: "No valid entry"});
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({err: err})
        });
};

exports.products_create_product = (req, res, next) => {
    
    const product =  new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.filename,
    });
    product
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product Created Successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err: err
        });
    });
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    var imageName = {};

    Product.findById(id)
        .select('productImage')
        .exec()
        .then(docs => {
            if (typeof (req.file) !== "undefined") {
                imageName = docs.productImage;
                fs.unlink(__rootdir + '\\public\\uploads\\' + imageName, err => {
                    console.log(err);
                    if (err && err.code == 'ENOENT') {
                        console.info("File does not exist, will not update");
                    } else if (err) {
                        console.info("Error occurred while trying to update");
                    } else {}
                });
            }
            return Product.findById( {_id: id}).exec();
        })
        .then(doc => {
            if (Object.keys(req.body.name).length > 0) {doc.name =  req.body.name;}
            if (Object.keys(req.body.price).length > 0) {doc.price = req.body.price;}
            if (typeof(req.file) !== "undefined") {doc.productImage = req.file.filename;}
            doc.save(err => {
                if (err) {
                    res.send(err);
                }
                res.status(200).json({
                    message: 'Product Updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000//products/' + id
                    }
                });
            });       
        });
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    var imageName = "";

    Product.findById(id)
        .select('productImage')
        .exec()
        .then(docs => {
            imageName = docs.productImage;
            fs.unlink(__rootdir + "\\public\\uploads\\" + imageName, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File does not exist, will not remove it.");
                } else if (err) {
                    console.info("Error occurred while trying to remove");
                } else {}
            });
            return Product.deleteOne({_id: id}).exec();
        })
        .then(() => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {
                        name: 'String',
                        price: 'Number',
                        productImage: 'String'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
};