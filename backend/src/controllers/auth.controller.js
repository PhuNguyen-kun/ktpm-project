const authService = require("../services/auth.service");
const asyncHandler = require("../middlewares/asyncHandler");
const { User } = require("../../models");
const { responseOk, responseError } = require("../utils/apiResponse");
const userResource = require("../resources/user.resource");

/**
 * Register a new user
 */
exports.register = asyncHandler(async (req, res) => {
    const { user, token } = await authService.register(req.body);

    return responseOk(
        res,
        { user: userResource(user), token },
        "User registered successfully"
    );
});

/**
 * User login
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    return responseOk(
        res,
        { user: userResource(user), token },
        "Login successfully"
    );
});

/**
 * Google OAuth login/register
 */
exports.googleAuth = asyncHandler(async (req, res) => {
    const { user, token } = await authService.googleAuth(req.body);

    return responseOk(
        res,
        { user: userResource(user), token },
        "Google authentication successful"
    );
});

/**
 * Get current user profile
 */
exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return responseError(res, "User not found", 404);
    }

    return responseOk(
        res,
        userResource(user),
        "User profile retrieved successfully"
    );
});
