const { FeeCampaign, FeeType, sequelize } = require("../../models");
const { Op } = require("sequelize");

exports.getAllFeeCampaigns = async ({
    page = null,
    per_page = null,
    search = null,
    fee_type_id = null,
    start_date = null,
    end_date = null,
}) => {
    // Build where clause
    const whereClause = {};

    if (search) {
        whereClause[Op.or] = [
            { note: { [Op.iLike]: `%${search}%` } },
            { "$FeeType.fee_name$": { [Op.iLike]: `%${search}%` } },
        ];
    }

    if (fee_type_id) {
        whereClause.fee_type_id = fee_type_id;
    }

    if (start_date) {
        whereClause.start_date = { [Op.gte]: start_date };
    }

    if (end_date) {
        whereClause.end_date = { [Op.lte]: end_date };
    }

    // Set up include options for fee type data
    const includeOptions = [
        {
            model: FeeType,
            attributes: [
                "id",
                "fee_name",
                "description",
                "is_mandatory",
                "unit",
                "calculation_method",
                "default_amount",
            ],
        },
    ];

    // Build base query options
    const queryOptions = {
        where: whereClause,
        include: includeOptions,
        order: [["start_date", "DESC"]],
        distinct: true,
    };

    // Apply pagination if specified
    if (page !== null && per_page !== null) {
        const offset = (page - 1) * per_page;
        queryOptions.offset = offset;
        queryOptions.limit = per_page;

        const { count, rows } = await FeeCampaign.findAndCountAll(queryOptions);

        return {
            data: rows,
            total: count,
        };
    } else {
        // No pagination - fetch all records
        const feeCampaigns = await FeeCampaign.findAll(queryOptions);

        return {
            data: feeCampaigns,
            total: feeCampaigns.length,
        };
    }
};

exports.getFeeCampaignById = async (id) => {
    return await FeeCampaign.findByPk(id, {
        include: [
            {
                model: FeeType,
                attributes: [
                    "id",
                    "fee_name",
                    "description",
                    "is_mandatory",
                    "unit",
                    "calculation_method",
                    "default_amount",
                ],
            },
        ],
    });
};

exports.createFeeCampaign = async (feeCampaignData) => {
    const { fee_type_id, start_date, end_date, note } = feeCampaignData;

    return await FeeCampaign.create({
        fee_type_id,
        start_date,
        end_date,
        note,
    });
};

exports.updateFeeCampaign = async (id, feeCampaignData) => {
    const feeCampaign = await FeeCampaign.findByPk(id);

    if (!feeCampaign) {
        return null;
    }

    await feeCampaign.update({
        fee_type_id: feeCampaignData.fee_type_id || feeCampaign.fee_type_id,
        start_date: feeCampaignData.start_date || feeCampaign.start_date,
        end_date: feeCampaignData.end_date || feeCampaign.end_date,
        note:
            feeCampaignData.note !== undefined
                ? feeCampaignData.note
                : feeCampaign.note,
    });

    return await this.getFeeCampaignById(id);
};

exports.deleteFeeCampaign = async (id) => {
    const feeCampaign = await FeeCampaign.findByPk(id);

    if (!feeCampaign) {
        return false;
    }

    await feeCampaign.destroy();

    return true;
};
