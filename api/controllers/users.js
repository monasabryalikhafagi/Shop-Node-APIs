
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signIn = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    messsage: " Auth Failed"
                });
            }

            bcrypt.compare(req.body.password, user[0].password, function (err, result) {
                if (err) {
                    res.status(401).json({
                        messsage: " Auth Failed"
                    });
                }

                if (result) {
                    var token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY,

                        {
                            expiresIn: "1h"
                        }
                    )
                    res.status(200).json({
                        messsage: " Auth successful",
                        token: token
                    });
                }

            });
        })
        .catch(err => {

            res.status(500).json({ err });
        });
}
exports.signUp = (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length > 0) {
                // can handel request but have conflect 
                res.status(409).json({
                    messsage: " Mail exist "
                })
            } else {
                console.log(req.body.password);
                console.log(req.body.email);
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ err });
                    } else {
                        let user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save().then(result => {
                            res.status(201).json({
                                messsage: "User created",
                                createdUser: result
                            });
                        });
                    }

                });
            }
        })
        .catch(err => {

            res.status(500).json({ error: err });
        });

}