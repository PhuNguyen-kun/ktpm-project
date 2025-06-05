const { query, body } = require("express-validator");

exports.getFeeTypesRequest = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    query("per_page")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Per page must be between 1 and 100"),

    query("search")
        .optional()
        .isString()
        .withMessage("Search must be a string")
        .isLength({ min: 1, max: 100 })
        .withMessage("Search term must be between 1 and 100 characters"),

    query("is_mandatory")
        .optional()
        .isBoolean()
        .withMessage("Is mandatory must be a boolean value"),
];

exports.createFeeTypeRequest = [
    body("fee_name")
        .notEmpty()
        .withMessage("Fee name is required")
        .isLength({ max: 255 })
        .withMessage("Fee name must not exceed 255 characters"),

    body("description")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description must not exceed 1000 characters"),

    body("is_mandatory")
        .notEmpty()
        .withMessage("Is mandatory field is required")
        .isBoolean()
        .withMessage("Is mandatory must be a boolean value"),

    body("unit")
        .notEmpty()
        .withMessage("Unit is required")
        .isInt({ min: 1, max: 3 })
        .withMessage("Unit must be a number between 1 and 3"),

    body("calculation_method")
        .notEmpty()
        .withMessage("Calculation method is required")
        .isInt({ min: 1, max: 3 })
        .withMessage("Calculation method must be a number between 1 and 3"),

    body("default_amount")
        .notEmpty()
        .withMessage("Default amount is required")
        .isFloat({ min: 0 })
        .withMessage("Default amount must be a positive number"),
];

exports.updateFeeTypeRequest = [
    body("fee_name")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Fee name must not exceed 255 characters"),

    body("description")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description must not exceed 1000 characters"),

    body("is_mandatory")
        .optional()
        .isBoolean()
        .withMessage("Is mandatory must be a boolean value"),

    body("unit")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Unit must be a number between 1 and 3"),

    body("calculation_method")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Calculation method must be a number between 1 and 3"),

    body("default_amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Default amount must be a positive number"),
];
