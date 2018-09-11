const mongoose = require('mongoose');

const Product = require('../models/product');
const fs =  require('fs');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('_id sourceLanguage destinationLanguage unitPrice file')
        .exec()
        .then(docs => {
            const response = {
                count:docs.length,
                products: docs.map(doc => {
                    return  {
                        _id: doc._id,
                        sourceLanguage: doc.sourceLanguage,
                        destinationLanguage: doc.destinationLanguage,
                        unitPrice: doc.unitPrice,
                        file: doc.file,
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
        .select('_id sourceLanguage destinationLanguage unitPrice file')
        .exec()
        .then(doc => {
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
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({err: err})
        });
};

exports.products_create_product = (req, res, next) => {
    
    const product =  new Product({
        _id: new mongoose.Types.ObjectId(),
        sourceLanguage: req.body.sourceLanguage,
        destinationLanguage: req.body.destinationLanguage,
        unitPrice: req.body.unitPrice,
        file: req.file.filename,
    });
    product
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product Created Successfully',
            createdProduct: {
                _id: result._id,
                sourceLanguage: result.sourceLanguage,
                destinationLanguage: result.destinationLanguage,
                unitPrice: result.unitPrice,
                file: result.file,
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
    var fileName = {};

    Product.findById(id)
        .select('file')
        .exec()
        .then(docs => {
            if (typeof (req.file) !== "undefined") {
                fileName = docs.file;
                fs.unlink(__rootdir + '\\public\\uploads\\' + fileName, err => {
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
            if (Object.keys(req.body.sourceLanguage).length > 0) {doc.sourceLanguage =  req.body.sourceLanguage;}
            if (Object.keys(req.body.destinationLanguage).length > 0) {doc.destinationLanguage =  req.body.destinationLanguage;}
            if (Object.keys(req.body.unitPrice).length > 0) {doc.unitPrice = req.body.unitPrice;}
            if (typeof(req.file) !== "undefined") {doc.file = req.file.filename;}
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
    var fileName = "";

    Product.findById(id)
        .select('file')
        .exec()
        .then(docs => {
            fileName = docs.file;
            fs.unlink(__rootdir + "\\public\\uploads\\" + fileName, function (err) {
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
                        sourceLanguage: 'String',
                        destinationLanguage: 'String',
                        unitPrice: 'Number',
                        file: 'String'
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