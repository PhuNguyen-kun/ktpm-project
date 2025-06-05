const { query, body, param } = require("express-validator");

exports.getHouseholdFeeAssignmentsRequest = [
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

    query("fee_campaign_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Fee campaign ID must be a positive integer"),

    query("payment_status")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Payment status must be between 1 and 3"),
];

exports.createHouseholdFeeAssignmentRequest = [
    body("fee_campaign_id")
        .notEmpty()
        .withMessage("Fee campaign ID is required")
        .isInt({ min: 1 })
        .withMessage("Fee campaign ID must be a positive integer"),

    body("household_id")
        .notEmpty()
        .withMessage("Household ID is required")
        .isInt({ min: 1 })
        .withMessage("Household ID must be a positive integer"),

    body("amount_due")
        .notEmpty()
        .withMessage("Amount due is required")
        .isFloat({ min: 0 })
        .withMessage("Amount due must be a positive number"),

    body("amount_paid")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Amount paid must be a positive number"),

    body("payment_date")
        .optional()
        .isDate()
        .withMessage("Payment date must be a valid date"),

    body("paid_by")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Paid by must be a positive integer"),

    body("payment_status")
        .notEmpty()
        .withMessage("Payment status is required")
        .isInt({ min: 1, max: 3 })
        .withMessage("Payment status must be between 1 and 3"),
];

exports.updateHouseholdFeeAssignmentRequest = [
    body("fee_campaign_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Fee campaign ID must be a positive integer"),

    body("household_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Household ID must be a positive integer"),

    body("amount_due")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Amount due must be a positive number"),

    body("amount_paid")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Amount paid must be a positive number"),

    body("payment_date")
        .optional()
        .isDate()
        .withMessage("Payment date must be a valid date"),

    body("paid_by")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Paid by must be a positive integer"),

    body("payment_status")
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage("Payment status must be between 1 and 3"),
];
