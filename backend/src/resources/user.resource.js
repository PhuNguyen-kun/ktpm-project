const user = require("../../models/user");

function userResource(user) {
    return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
    };
}

module.exports = userResource;
