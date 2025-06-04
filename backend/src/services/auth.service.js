const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const authConfig = require("../config/auth.config");
const ApiError = require("../utils/ApiError");

/**
 * Generate JWT token for a user
 * @param {Object} user
 * @returns {string} token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        authConfig.secret,
        { expiresIn: authConfig.jwtExpiration }
    );
};

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Promise<{user, token}>}
 */
const register = async (userData) => {
    const existingUser = await User.findOne({
        where: { email: userData.email },
    });
    if (existingUser) {
        throw new ApiError(400, "Email is already in use");
    }

    if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 8);
    }

    const user = await User.create(userData);

    const token = generateToken(user);

    const { password, ...userWithoutPassword } = user.toJSON();
    return { user: userWithoutPassword, token };
};

/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user, token}>}
 */
const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.password && !bcrypt.compareSync(password, user.password)) {
        throw new ApiError(401, "Invalid password");
    }

    const token = generateToken(user);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return { user: userWithoutPassword, token };
};

/**
 * Handle Google OAuth login/register
 * @param {Object} googleUserData
 * @returns {Promise<{user, token}>}
 */
const googleAuth = async (googleUserData) => {
    let user = await User.findOne({
        where: {
            [Sequelize.Op.or]: [
                { google_id: googleUserData.id },
                { email: googleUserData.email },
            ],
        },
    });

    if (!user) {
        user = await User.create({
            full_name: googleUserData.name,
            email: googleUserData.email,
            google_id: googleUserData.id,
            avatar_url: googleUserData.picture,
            role: 2,
        });
    } else if (!user.google_id) {
        user.google_id = googleUserData.id;
        await user.save();
    }

    const token = generateToken(user);

    return { user: user.toJSON(), token };
};

module.exports = {
    register,
    login,
    googleAuth,
    generateToken,
};
