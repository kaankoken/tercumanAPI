const mongoose = require('mongoose');
const Product = require('../models/product');
const Language = require('../models/language');
const fs =  require('fs');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('_id srcLang destLang translationPrice file')
        .exec()
        .then(docs => {
            const response = {
                productCount: docs.length.toString(),
                products: docs.map(doc => {
                    return  {
                        _id: doc._id,
                        srcLang: doc.srcLang,
                        destLang: doc.destLang,
                        translationPrice: doc.translationPrice,
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
};

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('_id srcLang destLang translationPrice file')
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
    var srcPrice;
    Language.find({language: req.body.srcLang})
        .exec()
        .then(src => {
            if (src.length < 1) {
                return res.status(404).json({
                    message: 'language does not exist'
                });
            }
            srcPrice = src[0].unitPrice;
            return Language.find({language: req.body.destLang}).exec();
        })
        .then(dest => {
            if (dest.length < 1) {
                return res.status(404).json({
                    message: 'language does not exist'
                });
            }
            const product =  new Product({
                _id: new mongoose.Types.ObjectId(),
                srcLang: req.body.srcLang,
                destLang: req.body.destLang,
                translationPrice: (srcPrice * dest[0].unitPrice),
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
                            srcLang: result.srcLang,
                            destLang: result.destLang,
                            translationPrice: result.translationPrice,
                            file: result.file,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + result._id
                            }
                        }
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
};

exports.products_update_product = (req, res, next) => { //dil değişimi ve fiyat değişimine bakılacak
    const id = req.params.productId;
    var fileName = {};

    Product.findById({_id: id})
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
            return Product.findById({_id: id}).exec();
        })
        .then(doc => {
            if (Object.keys(req.body.srcLang).length > 0) {doc.srcLang =  req.body.srcLang;}
            if (Object.keys(req.body.destLang).length > 0) {doc.destLang =  req.body.destLang;}
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
        })
        .catch(err => {
            console.log(err);
            res.staus(500).json({
                error: err
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
                        srcLang: 'String',
                        destLang: 'String',
                        translationPrice: 'Number',
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