const { body } = require("express-validator");

const loginValidation = [
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
];
const signupValidation = [
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('name').notEmpty().withMessage('Username is required'),
];

const changeUserName = [
    body('username').notEmpty().withMessage('Username is required'),
]

module.exports = {loginValidation,signupValidation};