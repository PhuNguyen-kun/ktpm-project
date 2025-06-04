const { Household, sequelize } = require("../../models");
const { Op } = require("sequelize");

/**
 * Get all households with filtering and pagination
 *
 * @param {Object} queryOptions - Query options for filtering and pagination
 * @param {number} queryOptions.page - Page number
 * @param {number} queryOptions.per_page - Records per page
 * @param {string} queryOptions.search - Search term
 * @param {boolean} queryOptions.include_residents - Whether to include residents
 * @returns {Promise<Object>} - Households with count and pagination data
 */
exports.getAllHouseholds = async ({
    page,
    per_page,
    search,
    include_residents,
}) => {
    const offset = (page - 1) * per_page;

    const whereClause = {};

    if (search) {
        whereClause[Op.or] = [
            { owner_name: { [Op.iLike]: `%${search}%` } },
            { apartment_code: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } },
            { phone_number: { [Op.like]: `%${search}%` } },
        ];
    }

    const includeOptions = [];

    if (include_residents === "true") {
        includeOptions.push({
            model: sequelize.models.Resident,
            attributes: [
                "id",
                "full_name",
                "identity_number",
                "phone_number",
                "birth_date",
                "birth_place",
            ],
        });
    }

    const { count, rows } = await Household.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        offset,
        limit: per_page,
        order: [["id", "DESC"]],
        distinct: true,
    });

    return {
        data: rows,
        total: count,
        page,
        per_page,
    };
};

/**
 * Get a household by ID
 *
 * @param {number} id - Household ID
 * @param {Object} options - Query options
 * @param {boolean} options.include_residents - Whether to include residents
 * @returns {Promise<Object>} - Household data
 */
exports.getHouseholdById = async (id) => {
    const household = await Household.findByPk(id, {
        include: [
            {
                model: sequelize.models.Resident,
                attributes: [
                    "id",
                    "full_name",
                    "phone_number",
                    "birth_date",
                    "birth_place",
                    "ethnicity",
                    "occupation",
                    "workplace",
                    "identity_number",
                    "issue_date",
                    "issue_place",
                    "status",
                    "gender",
                ],
            },
        ],
    });

    return household;
};

/**
 * Create a new household
 *
 * @param {Object} householdData - Household data
 * @param {string} householdData.owner_name - Owner's name
 * @param {string} householdData.apartment_code - Apartment code
 * @param {string} householdData.address - Address
 * @param {string} householdData.phone_number - Phone number
 * @returns {Promise<Object>} - Created household
 */
exports.createHousehold = async (householdData) => {
    const { owner_name, apartment_code, address, phone_number } = householdData;

    return await Household.create({
        owner_name,
        apartment_code,
        address,
        phone_number,
    });
};

/**
 * Update a household
 *
 * @param {number} id - Household ID
 * @param {Object} householdData - Updated household data
 * @returns {Promise<Object>} - Updated household or null if not found
 */
exports.updateHousehold = async (id, householdData) => {
    const household = await Household.findByPk(id);

    if (!household) {
        return null;
    }

    await household.update({
        owner_name: householdData.owner_name || household.owner_name,
        apartment_code:
            householdData.apartment_code || household.apartment_code,
        address: householdData.address || household.address,
        phone_number: householdData.phone_number || household.phone_number,
    });

    return household;
};

/**
 * Delete a household
 *
 * @param {number} id - Household ID
 * @returns {Promise<boolean>} - Success status
 */
exports.deleteHousehold = async (id) => {
    const household = await Household.findByPk(id);

    if (!household) {
        return false;
    }

    await household.destroy();

    return true;
};
