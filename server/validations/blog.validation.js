const { body } = require("express-validator");


const blogValidation = [
    body("title").notEmpty().withMessage("Title must not be empty"),
    body("title").isString().withMessage("Title must be a String"),
    body("subtitle").notEmpty().withMessage("Subtitle must not be empty"),
    body("subtitle").isString().withMessage("Subtitle must be a String"),
    body("subtitle").isLength({max:160}).withMessage("Subtitle must be less than 160 characters."),
    body("topics").isArray({max:5}).withMessage("Topics must be less than 5"),
    body("previewImage").optional({values:"falsy"}).isString(),
]

module.exports = {blogValidation};