const { query, body, param } = require("express-validator");

exports.getFeeCampaignsRequest = [
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

    query("fee_type_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Fee type ID must be a positive integer"),

    query("start_date")
        .optional()
        .isDate()
        .withMessage("Start date must be a valid date"),

    query("end_date")
        .optional()
        .isDate()
        .withMessage("End date must be a valid date")
        .custom((value, { req }) => {
            if (req.query.start_date && value < req.query.start_date) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),
];

exports.createFeeCampaignRequest = [
    body("fee_type_id")
        .notEmpty()
        .withMessage("Fee type ID is required")
        .isInt({ min: 1 })
        .withMessage("Fee type ID must be a positive integer"),

    body("start_date")
        .notEmpty()
        .withMessage("Start date is required")
        .isDate()
        .withMessage("Start date must be a valid date"),

    body("end_date")
        .notEmpty()
        .withMessage("End date is required")
        .isDate()
        .withMessage("End date must be a valid date")
        .custom((value, { req }) => {
            if (req.body.start_date && value < req.body.start_date) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),

    body("note")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Note must not exceed 1000 characters"),
];

exports.updateFeeCampaignRequest = [
    body("fee_type_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Fee type ID must be a positive integer"),

    body("start_date")
        .optional()
        .isDate()
        .withMessage("Start date must be a valid date"),

    body("end_date")
        .optional()
        .isDate()
        .withMessage("End date must be a valid date")
        .custom((value, { req }) => {
            if (req.body.start_date && value < req.body.start_date) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),

    body("note")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Note must not exceed 1000 characters"),
];
