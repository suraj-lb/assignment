const { check, validationResult } = require('express-validator');
const User = require('../model/user');
exports.validateUser = [
    check('firstName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('First name can not be empty!')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required!')
        .bail(),
    check('lastName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Last name can not be empty!')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required!')
        .bail(),
    check('email')
        .trim()
        .normalizeEmail()
        .not()
        .isEmpty()
        .withMessage('Invalid email address!')
        .bail()
        .custom(value => {
            return User.find({ email: value })
                .then((data) => {
                    if (data.length > 0) {
                        return Promise.reject('Email already taken')
                    }
                })
        }),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Password must be more that 6 charecters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];