const asyncHandler = require("../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    generatePaginationData,
} = require("../utils/apiResponse");
const feeTypeService = require("../services/fee_type.service");
const feeTypeResource = require("../resources/fee_type.resource");

exports.getAllFeeTypes = asyncHandler(async (req, res) => {
    const {
        page: pageParam,
        per_page: perPageParam,
        search,
        is_mandatory,
    } = req.query;

    // Check if pagination is needed
    const isPaginated = pageParam !== undefined;

    if (isPaginated) {
        const page = parseInt(pageParam) || 1;
        const per_page = parseInt(perPageParam) || 10;

        const { data, total } = await feeTypeService.getAllFeeTypes({
            page,
            per_page,
            search,
            is_mandatory:
                is_mandatory !== undefined ? is_mandatory === "true" : null,
        });

        const pagination = generatePaginationData(total, page, per_page);

        const formattedFeeTypes = data.map((feeType) =>
            feeTypeResource(feeType)
        );

        return responseOk(
            res,
            formattedFeeTypes,
            "Fee types retrieved successfully",
            200,
            pagination
        );
    } else {
        const { data } = await feeTypeService.getAllFeeTypes({
            page: null,
            per_page: null,
            search,
            is_mandatory:
                is_mandatory !== undefined ? is_mandatory === "true" : null,
        });

        const formattedFeeTypes = data.map((feeType) =>
            feeTypeResource(feeType)
        );

        return responseOk(
            res,
            formattedFeeTypes,
            "All fee types retrieved successfully",
            200
        );
    }
});

exports.getFeeTypeById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const feeType = await feeTypeService.getFeeTypeById(id);

    if (!feeType) {
        return responseError(res, "Fee type not found", 404);
    }

    return responseOk(
        res,
        feeTypeResource(feeType),
        "Fee type retrieved successfully",
        200
    );
});

exports.createFeeType = asyncHandler(async (req, res) => {
    const {
        fee_name,
        description,
        is_mandatory,
        calculation_method,
        default_amount,
    } = req.body;

    const feeType = await feeTypeService.createFeeType({
        fee_name,
        description,
        is_mandatory,
        calculation_method,
        default_amount,
    });

    return responseOk(
        res,
        feeTypeResource(feeType),
        "Fee type created successfully",
        201
    );
});

exports.updateFeeType = asyncHandler(async (req, res) => {
    const {
        fee_name,
        description,
        is_mandatory,
        calculation_method,
        default_amount,
    } = req.body;
    const id = req.params.id;

    const feeType = await feeTypeService.updateFeeType(id, {
        fee_name,
        description,
        is_mandatory,
        calculation_method,
        default_amount,
    });

    if (!feeType) {
        return responseError(res, "Fee type not found", 404);
    }

    return responseOk(
        res,
        feeTypeResource(feeType),
        "Fee type updated successfully",
        200
    );
});

exports.deleteFeeType = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const success = await feeTypeService.deleteFeeType(id);

    if (!success) {
        return responseError(res, "Fee type not found", 404);
    }

    return responseOk(res, null, "Fee type deleted successfully", 200);
});
