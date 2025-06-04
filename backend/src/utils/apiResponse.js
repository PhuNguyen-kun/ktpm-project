/**
 * Generate pagination metadata
 * @param {Number} count - Total number of records
 * @param {Number} page - Current page number
 * @param {Number} per_page - Number of items per page
 * @returns {Object} - Pagination metadata
 */
function generatePaginationData(count, page, per_page) {
    const offset = (page - 1) * per_page;

    return {
        total: count,
        per_page,
        current_page: page,
        last_page: Math.ceil(count / per_page),
        from: count > 0 ? offset + 1 : 0,
        to: Math.min(offset + per_page, count),
    };
}

/**
 * Send successful response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {String} message - Response message
 * @param {Number} statusCode - HTTP status code
 * @param {Object} pagination - Pagination metadata
 * @returns {Object} - Express response
 */
function responseOk(
    res,
    data = null,
    message = "Success",
    statusCode = 200,
    pagination = null
) {
    const response = {
        success: true,
        message,
        data,
    };

    if (pagination) {
        response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
}

function responseError(
    res,
    message = "Error",
    statusCode = 400,
    errors = null
) {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
}

/**
 * Paginate data based on request parameters
 * @param {Object} req - Express request object
 * @param {Function} queryFn - Async function that returns { count, rows }
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Paginated data with metadata
 */
async function paginate(req, queryFn, options = {}) {
    // Check if pagination is requested
    if (req.query.page) {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        // Calculate offset for database query
        const offset = (page - 1) * per_page;

        // Execute the query function with pagination params
        const { count, rows } = await queryFn({
            limit: per_page,
            offset,
            ...options,
        });

        // Return data with pagination metadata
        return {
            data: rows,
            pagination: generatePaginationData(count, page, per_page),
        };
    } else {
        // No pagination requested, return all records
        const { count, rows } = await queryFn({ ...options });

        return {
            data: rows,
            count,
        };
    }
}

module.exports = {
    responseOk,
    responseError,
    paginate,
    generatePaginationData,
};
