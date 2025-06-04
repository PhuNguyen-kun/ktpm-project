const asyncHandler = require("../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    generatePaginationData,
} = require("../utils/apiResponse");
const residentService = require("../services/resident.service");
const residentResource = require("../resources/resident.resource");

exports.getAllResidents = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const { search, household_id, status } = req.query;

    const { data, total } = await residentService.getAllResidents({
        page,
        per_page,
        search,
        household_id,
        status,
    });

    const pagination = generatePaginationData(total, page, per_page);

    const formattedResidents = data.map((resident) =>
        residentResource(resident)
    );

    return responseOk(
        res,
        formattedResidents,
        "Residents retrieved successfully",
        200,
        pagination
    );
});

exports.getResidentById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const include_logs = req.query.include_logs === "true";

    const resident = await residentService.getResidentById(id, include_logs);

    if (!resident) {
        return responseError(res, "Resident not found", 404);
    }

    return responseOk(
        res,
        residentResource(resident),
        "Resident retrieved successfully",
        200
    );
});

exports.createResident = asyncHandler(async (req, res) => {
    const {
        household_id,
        full_name,
        phone_number,
        birth_date,
        birth_place,
        ethnicity,
        occupation,
        workplace,
        identity_number,
        issue_date,
        issue_place,
        status,
        gender,
        change_log,
    } = req.body;

    const resident = await residentService.createResident({
        household_id,
        full_name,
        phone_number,
        birth_date,
        birth_place,
        ethnicity,
        occupation,
        workplace,
        identity_number,
        issue_date,
        issue_place,
        status,
        gender,
        change_log,
    });

    return responseOk(
        res,
        residentResource(resident),
        "Resident created successfully",
        201
    );
});

exports.updateResident = asyncHandler(async (req, res) => {
    const {
        household_id,
        full_name,
        phone_number,
        birth_date,
        birth_place,
        ethnicity,
        occupation,
        workplace,
        identity_number,
        issue_date,
        issue_place,
        status,
        gender,
        change_log,
    } = req.body;
    const id = req.params.id;

    const resident = await residentService.updateResident(id, {
        household_id,
        full_name,
        phone_number,
        birth_date,
        birth_place,
        ethnicity,
        occupation,
        workplace,
        identity_number,
        issue_date,
        issue_place,
        status,
        gender,
        change_log,
    });

    if (!resident) {
        return responseError(res, "Resident not found", 404);
    }

    return responseOk(
        res,
        residentResource(resident),
        "Resident updated successfully",
        200
    );
});

exports.deleteResident = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const resident = await residentService.deleteResident(id);

    if (!resident) {
        return responseError(res, "Resident not found", 404);
    }

    return responseOk(res, {}, "Resident deleted successfully", 200);
});
