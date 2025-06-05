const asyncHandler = require("../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    generatePaginationData,
} = require("../utils/apiResponse");
const householdFeeAssignmentService = require("../services/household_fee_assignment.service");
const householdFeeAssignmentResource = require("../resources/household_fee_assignment.resource");

exports.getAllHouseholdFeeAssignments = asyncHandler(async (req, res) => {
    const {
        page: pageParam,
        per_page: perPageParam,
        search,
        household_id,
        fee_campaign_id,
        payment_status,
    } = req.query;

    // Check if pagination is needed
    const isPaginated = pageParam !== undefined;

    if (isPaginated) {
        const page = parseInt(pageParam) || 1;
        const per_page = parseInt(perPageParam) || 10;

        const { data, total } =
            await householdFeeAssignmentService.getAllHouseholdFeeAssignments({
                page,
                per_page,
                search,
                household_id: household_id ? parseInt(household_id) : null,
                fee_campaign_id: fee_campaign_id
                    ? parseInt(fee_campaign_id)
                    : null,
                payment_status: payment_status
                    ? parseInt(payment_status)
                    : null,
            });

        const pagination = generatePaginationData(total, page, per_page);

        const formattedAssignments = data.map((assignment) =>
            householdFeeAssignmentResource(assignment)
        );

        return responseOk(
            res,
            formattedAssignments,
            "Household fee assignments retrieved successfully",
            200,
            pagination
        );
    } else {
        const { data } =
            await householdFeeAssignmentService.getAllHouseholdFeeAssignments({
                page: null,
                per_page: null,
                search,
                household_id: household_id ? parseInt(household_id) : null,
                fee_campaign_id: fee_campaign_id
                    ? parseInt(fee_campaign_id)
                    : null,
                payment_status: payment_status
                    ? parseInt(payment_status)
                    : null,
            });

        const formattedAssignments = data.map((assignment) =>
            householdFeeAssignmentResource(assignment)
        );

        return responseOk(
            res,
            formattedAssignments,
            "All household fee assignments retrieved successfully",
            200
        );
    }
});

exports.getHouseholdFeeAssignmentById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const assignment =
        await householdFeeAssignmentService.getHouseholdFeeAssignmentById(id);

    if (!assignment) {
        return responseError(res, "Household fee assignment not found", 404);
    }

    return responseOk(
        res,
        householdFeeAssignmentResource(assignment),
        "Household fee assignment retrieved successfully",
        200
    );
});

exports.createHouseholdFeeAssignment = asyncHandler(async (req, res) => {
    const {
        fee_campaign_id,
        household_id,
        amount_due,
        amount_paid,
        payment_date,
        paid_by,
        payment_status,
    } = req.body;

    const assignment =
        await householdFeeAssignmentService.createHouseholdFeeAssignment({
            fee_campaign_id,
            household_id,
            amount_due,
            amount_paid,
            payment_date,
            paid_by,
            payment_status,
        });

    return responseOk(
        res,
        householdFeeAssignmentResource(assignment),
        "Household fee assignment created successfully",
        201
    );
});

exports.updateHouseholdFeeAssignment = asyncHandler(async (req, res) => {
    const {
        fee_campaign_id,
        household_id,
        amount_due,
        amount_paid,
        payment_date,
        paid_by,
        payment_status,
    } = req.body;
    const id = req.params.id;

    const assignment =
        await householdFeeAssignmentService.updateHouseholdFeeAssignment(id, {
            fee_campaign_id,
            household_id,
            amount_due,
            amount_paid,
            payment_date,
            paid_by,
            payment_status,
        });

    if (!assignment) {
        return responseError(res, "Household fee assignment not found", 404);
    }

    return responseOk(
        res,
        householdFeeAssignmentResource(assignment),
        "Household fee assignment updated successfully",
        200
    );
});

exports.deleteHouseholdFeeAssignment = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const success =
        await householdFeeAssignmentService.deleteHouseholdFeeAssignment(id);

    if (!success) {
        return responseError(res, "Household fee assignment not found", 404);
    }

    return responseOk(
        res,
        null,
        "Household fee assignment deleted successfully",
        200
    );
});
