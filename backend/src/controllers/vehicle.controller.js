const asyncHandler = require("../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    generatePaginationData,
} = require("../utils/apiResponse");
const vehicleService = require("../services/vehicle.service");
const vehicleResource = require("../resources/vehicle.resource");

exports.getAllVehicles = asyncHandler(async (req, res) => {
    const {
        page: pageParam,
        per_page: perPageParam,
        search,
        household_id,
        type,
    } = req.query;

    // Check if pagination is needed
    const isPaginated = pageParam !== undefined;

    if (isPaginated) {
        const page = parseInt(pageParam) || 1;
        const per_page = parseInt(perPageParam) || 10;

        const { data, total } = await vehicleService.getAllVehicles({
            page,
            per_page,
            search,
            household_id: household_id ? parseInt(household_id) : null,
            type: type ? parseInt(type) : null,
        });

        const pagination = generatePaginationData(total, page, per_page);

        const formattedVehicles = data.map((vehicle) =>
            vehicleResource(vehicle)
        );

        return responseOk(
            res,
            formattedVehicles,
            "Vehicles retrieved successfully",
            200,
            pagination
        );
    } else {
        const { data } = await vehicleService.getAllVehicles({
            page: null,
            per_page: null,
            search,
            household_id: household_id ? parseInt(household_id) : null,
            type: type ? parseInt(type) : null,
        });

        const formattedVehicles = data.map((vehicle) =>
            vehicleResource(vehicle)
        );

        return responseOk(
            res,
            formattedVehicles,
            "All vehicles retrieved successfully",
            200
        );
    }
});

exports.getVehicleById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
        return responseError(res, "Vehicle not found", 404);
    }

    return responseOk(
        res,
        vehicleResource(vehicle),
        "Vehicle retrieved successfully",
        200
    );
});

exports.createVehicle = asyncHandler(async (req, res) => {
    const { household_id, type, plate_number, registered_date } = req.body;

    const vehicle = await vehicleService.createVehicle({
        household_id,
        type,
        plate_number,
        registered_date,
    });

    return responseOk(
        res,
        vehicleResource(vehicle),
        "Vehicle created successfully",
        201
    );
});

exports.updateVehicle = asyncHandler(async (req, res) => {
    const { household_id, type, plate_number, registered_date } = req.body;
    const id = req.params.id;

    const vehicle = await vehicleService.updateVehicle(id, {
        household_id,
        type,
        plate_number,
        registered_date,
    });

    if (!vehicle) {
        return responseError(res, "Vehicle not found", 404);
    }

    return responseOk(
        res,
        vehicleResource(vehicle),
        "Vehicle updated successfully",
        200
    );
});

exports.deleteVehicle = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const success = await vehicleService.deleteVehicle(id);

    if (!success) {
        return responseError(res, "Vehicle not found", 404);
    }

    return responseOk(res, null, "Vehicle deleted successfully", 200);
});
