const { query, body, param } = require("express-validator");

exports.getHouseholdsRequest = [
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

    query("include_residents")
        .optional()
        .isBoolean()
        .withMessage("Include residents must be a boolean")
        .toBoolean(),
];

exports.createHouseholdRequest = [
    body("owner_name")
        .notEmpty()
        .withMessage("Owner name is required")
        .isLength({ max: 255 })
        .withMessage("Owner name must not exceed 255 characters"),

    body("apartment_code")
        .notEmpty()
        .withMessage("Apartment code is required")
        .isLength({ max: 50 })
        .withMessage("Apartment code must not exceed 50 characters"),

    body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ max: 255 })
        .withMessage("Address must not exceed 255 characters"),

    body("phone_number")
        .notEmpty()
        .withMessage("Phone number is required")
        .isLength({ max: 20 })
        .withMessage("Phone number must not exceed 20 characters"),
];

exports.updateHouseholdRequest = [
    param("id").isInt({ min: 1 }).withMessage("Invalid household ID"),

    body("owner_name")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Owner name must not exceed 255 characters"),

    body("apartment_code")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Apartment code must not exceed 50 characters"),

    body("address")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Address must not exceed 255 characters"),

    body("phone_number")
        .optional()
        .isLength({ max: 20 })
        .withMessage("Phone number must not exceed 20 characters"),
];
