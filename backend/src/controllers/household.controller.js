const asyncHandler = require("../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    generatePaginationData,
} = require("../utils/apiResponse");
const householdService = require("../services/household.service");
const householdResource = require("../resources/household.resource");

/**
 * Get all households with pagination and filtering
 */
exports.getAllHouseholds = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const { search, include_residents } = req.query;

    const { data, total } = await householdService.getAllHouseholds({
        page,
        per_page,
        search,
        include_residents,
    });

    const pagination = generatePaginationData(total, page, per_page);

    const formattedHouseholds = data.map((household) =>
        householdResource(household)
    );

    return responseOk(
        res,
        formattedHouseholds,
        "Households retrieved successfully",
        200,
        pagination
    );
});

/**
 * Get a household by ID
 */
/**
 * Get a household by ID
 */
exports.getHouseholdById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const household = await householdService.getHouseholdById(id);

    if (!household) {
        return responseError(res, "Household not found", 404);
    }

    return responseOk(
        res,
        householdResource(household),
        "Household retrieved successfully",
        200
    );
});

/**
 * Create a new household
 */
exports.createHousehold = asyncHandler(async (req, res) => {
    const { owner_name, apartment_code, address, phone_number } = req.body;

    const household = await householdService.createHousehold({
        owner_name,
        apartment_code,
        address,
        phone_number,
    });

    return responseOk(
        res,
        householdResource(household),
        "Household created successfully",
        201
    );
});

/**
 * Update a household
 */
exports.updateHousehold = asyncHandler(async (req, res) => {
    const { owner_name, apartment_code, address, phone_number } = req.body;
    const id = req.params.id;

    const household = await householdService.updateHousehold(id, {
        owner_name,
        apartment_code,
        address,
        phone_number,
    });

    if (!household) {
        return responseError(res, "Household not found", 404);
    }

    return responseOk(
        res,
        householdResource(household),
        "Household updated successfully",
        200
    );
});

/**
 * Delete a household
 */
exports.deleteHousehold = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const success = await householdService.deleteHousehold(id);

    if (!success) {
        return responseError(res, "Household not found", 404);
    }

    return responseOk(res, null, "Household deleted successfully", 200);
});
