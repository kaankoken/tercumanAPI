const mongoose = require('mongoose');
const UserRole =  require('../models/user_role');

exports.userrole_get_all = (req, res, next) => {
    UserRole.find()
        .select('_id role')
        .exec()
        .then(docs => {
            res.status(200).json({
                roleCount: docs.length,
                Role: docs.map(doc => {
                    return {
                        _id: doc._id,
                        role: doc.role,
                        request: {
                            type: 'GET'
                        }
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

exports.userrole_create_role = (req, res, next) => {
    UserRole.find({role: req.body.role})
        .exec()
        .then(docs => {
            if (docs.length >= 1) {
                return res.status(409).json({
                    message: 'Role Exist',
                });
            }
            const user_role = new UserRole({
                _id: new mongoose.Types.ObjectId,
                role: req.body.role
            });

            user_role
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'role has been created',
                        createdRole: {
                            _id: result._id,
                            role: result.role,
                            request: {
                                type: 'POST'
                            }
                        }
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.userrole_delete_role = (req, res, next) => {
    const id = req.params.roleId;
    UserRole.findById({_id: id})
        .exec()
        .then(docs => {
            if (!docs) {
                return res.status(409).json({
                    message: 'Role not found'
                });
            }
            return UserRole.deleteOne({_id: id}).exec();
        })
        .then(() => {
            res.status(200).json({
                message: 'Role deleted',
                request: {
                    type: 'POST',
                    body: {
                        role: 'String'
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