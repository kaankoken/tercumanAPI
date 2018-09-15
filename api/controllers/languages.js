const mongoose = require('mongoose');
const Language = require('../models/language');

exports.languages_get_all = (req, res, next) => {
    Language.find()
        .select('_id language unitPrice')
        .exec()
        .then(docs => {
            res.status(200).json({
                langCount: docs.length,
                Language: docs.map(doc => {
                    return {
                        _id: doc._id,
                        language: doc.language,
                        unitPrice: doc.unitPrice,
                        request: {
                            type: 'GET'
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

exports.languages_create_lang = (req, res, next) => {
    Language.find({language: req.body.language})
    .exec()
    .then(lang => {
        if (lang.length >= 1) {
            return res.status(409).json({
                message: 'Language Exist',
            });
        }   
        const langs =  new Language({
            _id: new mongoose.Types.ObjectId(),
            language: req.body.language,
            unitPrice: req.body.unitPrice
        });
  
        langs
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Language has been recorded',
                    createadLanguage: {
                        _id: result._id,
                        language: result.language,
                        unitPrice: result.unitPrice,
                        request: {
                            type: 'POST'
                        }
                    }
                });
            });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
};

exports.languages_update_lang = (req, res, next) => {
    const id = req.params.languageId;
    Language.findById({_id: id})
        .exec()
        .then(lang => {
            if (!lang) {
                return res.status(404).json({
                    message: 'Language not found',
                });
            }
            return Language.findById({_id: id}).exec();
        })
        .then(docs => {
            if (Object.keys(req.body.language).length > 0) {docs.language = req.body.language;}
            if (Object.keys(req.body.unitPrice).length > 0) {docs.unitPrice = req.body.unitPrice;}
            docs.save(err => {
                if (err) {
                    res.send(err);
                }
                res.status(200).json({
                    message: 'Language Updated',
                    request: {
                        type: 'GET'
                    }
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err,
            });
        });
};

exports.languages_delete_lang = (req, res, next) => {
    const id = req.params.languageId;
    Language.findById({_id: id})
        .exec()
        .then(lang => {
            if (!lang) {
                return res.status(404).json({
                    message: 'Language not found'
                });
            }
            return Language.deleteOne({_id: id}).exec();
        })
        .then(() => {
            res.status(200).json({
                message: 'Language Deleted',
                request: {
                    type: 'POST',
                    body: {
                        language: 'String',
                        unitPrice: 'Number',
                    }
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