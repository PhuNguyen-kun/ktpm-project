const { query, body, param } = require("express-validator");

exports.getResidentsRequest = [
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

    query("status")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Status must be a number between 1 and 3"),

    query("include_logs")
        .optional()
        .isBoolean()
        .withMessage("Include logs must be a boolean")
        .toBoolean(),
];

exports.createResidentRequest = [
    body("household_id")
        .notEmpty()
        .withMessage("Household ID is required")
        .isInt({ min: 1 })
        .withMessage("Household ID must be a positive integer"),

    body("full_name")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ max: 255 })
        .withMessage("Full name must not exceed 255 characters"),

    body("phone_number")
        .optional()
        .isLength({ max: 20 })
        .withMessage("Phone number must not exceed 20 characters"),

    body("birth_date")
        .optional()
        .isDate()
        .withMessage("Birth date must be a valid date"),

    body("birth_place")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Birth place must not exceed 255 characters"),

    body("ethnicity")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Ethnicity must not exceed 50 characters"),

    body("occupation")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Occupation must not exceed 255 characters"),

    body("workplace")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Workplace must not exceed 255 characters"),

    body("identity_number")
        .optional()
        .isLength({ max: 20 })
        .withMessage("Identity number must not exceed 20 characters"),

    body("issue_date")
        .optional()
        .isDate()
        .withMessage("Issue date must be a valid date"),

    body("issue_place")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Issue place must not exceed 255 characters"),

    body("status")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Status must be a number between 1 and 3"),

    body("gender")
        .optional()
        .isInt({ min: 1, max: 2 })
        .withMessage("Gender must be a number between 1 and 2"),

    body("change_log")
        .optional()
        .isObject()
        .withMessage("Change log must be an object"),

    body("change_log.change_type")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Change type must be a number between 1 and 3"),

    body("change_log.change_date")
        .optional()
        .isDate()
        .withMessage("Change date must be a valid date"),

    body("change_log.note")
        .optional()
        .isString()
        .withMessage("Note must be a string"),
];

exports.updateResidentRequest = [
    body("full_name")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Full name must not exceed 255 characters"),

    body("phone_number")
        .optional()
        .isLength({ max: 20 })
        .withMessage("Phone number must not exceed 20 characters"),

    body("birth_date")
        .optional()
        .isDate()
        .withMessage("Birth date must be a valid date"),

    body("birth_place")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Birth place must not exceed 255 characters"),

    body("ethnicity")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Ethnicity must not exceed 50 characters"),

    body("occupation")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Occupation must not exceed 255 characters"),

    body("workplace")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Workplace must not exceed 255 characters"),

    body("identity_number")
        .optional()
        .isLength({ max: 20 })
        .withMessage("Identity number must not exceed 20 characters"),

    body("issue_date")
        .optional()
        .isDate()
        .withMessage("Issue date must be a valid date"),

    body("issue_place")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Issue place must not exceed 255 characters"),

    body("status")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Status must be a number between 1 and 3"),

    body("gender")
        .optional()
        .isInt({ min: 1, max: 2 })
        .withMessage("Gender must be a number between 1 and 2"),

    body("household_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Household ID must be a positive integer"),

    body("change_log")
        .optional()
        .isObject()
        .withMessage("Change log must be an object"),

    body("change_log.change_type")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Change type must be a number between 1 and 3"),

    body("change_log.change_date")
        .optional()
        .isDate()
        .withMessage("Change date must be a valid date"),

    body("change_log.note")
        .optional()
        .isString()
        .withMessage("Note must be a string"),
];
