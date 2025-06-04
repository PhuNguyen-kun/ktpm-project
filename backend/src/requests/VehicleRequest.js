const { query, body, param } = require("express-validator");

exports.getVehiclesRequest = [
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

    query("household_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Household ID must be a positive integer"),

    query("type")
        .optional()
        .isInt({ min: 1, max: 2 })
        .withMessage("Type must be a number between 1 and 2"),
];

exports.createVehicleRequest = [
    body("household_id")
        .notEmpty()
        .withMessage("Household ID is required")
        .isInt({ min: 1 })
        .withMessage("Household ID must be a positive integer"),

    body("type")
        .notEmpty()
        .withMessage("Vehicle type is required")
        .isInt({ min: 1, max: 2 })
        .withMessage("Type must be 1 (motorcycle) or 2 (car)"),

    body("plate_number")
        .notEmpty()
        .withMessage("Plate number is required")
        .isLength({ min: 1, max: 20 })
        .withMessage("Plate number must not exceed 20 characters"),

    body("registered_date")
        .optional()
        .isDate()
        .withMessage("Registered date must be a valid date"),
];

exports.updateVehicleRequest = [
    body("household_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Household ID must be a positive integer"),

    body("type")
        .optional()
        .isInt({ min: 1, max: 2 })
        .withMessage("Type must be 1 (motorcycle) or 2 (car)"),

    body("plate_number")
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage("Plate number must not exceed 20 characters"),

    body("registered_date")
        .optional()
        .isDate()
        .withMessage("Registered date must be a valid date"),
];
