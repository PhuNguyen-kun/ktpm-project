const slugify = require("slugify");

/**
 * Generate slug from a string (typically name/title)
 * @param {string} str
 * @returns {string} slugified string
 */
function generateSlugFromName(str) {
    return slugify(str, {
        lower: true,
        strict: true,
        locale: "vi",
    });
}

module.exports = { generateSlugFromName };
