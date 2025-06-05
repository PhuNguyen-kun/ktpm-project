const asyncHandler = require("../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    generatePaginationData,
} = require("../utils/apiResponse");
const feeCampaignService = require("../services/fee_campaign.service");
const feeCampaignResource = require("../resources/fee_campaign.resource");

exports.getAllFeeCampaigns = asyncHandler(async (req, res) => {
    const {
        page: pageParam,
        per_page: perPageParam,
        search,
        fee_type_id,
        start_date,
        end_date,
    } = req.query;

    // Check if pagination is needed
    const isPaginated = pageParam !== undefined;

    if (isPaginated) {
        const page = parseInt(pageParam) || 1;
        const per_page = parseInt(perPageParam) || 10;

        const { data, total } = await feeCampaignService.getAllFeeCampaigns({
            page,
            per_page,
            search,
            fee_type_id: fee_type_id ? parseInt(fee_type_id) : null,
            start_date,
            end_date,
        });

        const pagination = generatePaginationData(total, page, per_page);

        const formattedFeeCampaigns = data.map((feeCampaign) =>
            feeCampaignResource(feeCampaign)
        );

        return responseOk(
            res,
            formattedFeeCampaigns,
            "Fee campaigns retrieved successfully",
            200,
            pagination
        );
    } else {
        const { data } = await feeCampaignService.getAllFeeCampaigns({
            page: null,
            per_page: null,
            search,
            fee_type_id: fee_type_id ? parseInt(fee_type_id) : null,
            start_date,
            end_date,
        });

        const formattedFeeCampaigns = data.map((feeCampaign) =>
            feeCampaignResource(feeCampaign)
        );

        return responseOk(
            res,
            formattedFeeCampaigns,
            "All fee campaigns retrieved successfully",
            200
        );
    }
});

exports.getFeeCampaignById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const feeCampaign = await feeCampaignService.getFeeCampaignById(id);

    if (!feeCampaign) {
        return responseError(res, "Fee campaign not found", 404);
    }

    return responseOk(
        res,
        feeCampaignResource(feeCampaign),
        "Fee campaign retrieved successfully",
        200
    );
});

exports.createFeeCampaign = asyncHandler(async (req, res) => {
    const { fee_type_id, start_date, end_date, note } = req.body;

    const feeCampaign = await feeCampaignService.createFeeCampaign({
        fee_type_id,
        start_date,
        end_date,
        note,
    });

    const fullFeeCampaign = await feeCampaignService.getFeeCampaignById(
        feeCampaign.id
    );

    return responseOk(
        res,
        feeCampaignResource(fullFeeCampaign),
        "Fee campaign created successfully",
        201
    );
});

exports.updateFeeCampaign = asyncHandler(async (req, res) => {
    const { fee_type_id, start_date, end_date, note } = req.body;
    const id = req.params.id;

    const feeCampaign = await feeCampaignService.updateFeeCampaign(id, {
        fee_type_id,
        start_date,
        end_date,
        note,
    });

    if (!feeCampaign) {
        return responseError(res, "Fee campaign not found", 404);
    }

    return responseOk(
        res,
        feeCampaignResource(feeCampaign),
        "Fee campaign updated successfully",
        200
    );
});

exports.deleteFeeCampaign = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const success = await feeCampaignService.deleteFeeCampaign(id);

    if (!success) {
        return responseError(res, "Fee campaign not found", 404);
    }

    return responseOk(res, null, "Fee campaign deleted successfully", 200);
});
