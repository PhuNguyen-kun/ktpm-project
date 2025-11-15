// Validation bypassed as requested
module.exports = (req, res, next) => {
    // Skip all validation and move to the next middleware
    next();
};
