const {
    HouseholdFeeAssignment,
    FeeCampaign,
    FeeType,
    Household,
    Resident,
    sequelize,
} = require("../../models");
const { Op } = require("sequelize");

exports.getAllHouseholdFeeAssignments = async ({
    page = null,
    per_page = null,
    search = null,
    household_id = null,
    fee_campaign_id = null,
    payment_status = null,
}) => {
    // Build where clause
    const whereClause = {};

    if (search) {
        whereClause[Op.or] = [
            { "$Household.apartment_code$": { [Op.iLike]: `%${search}%` } },
            { "$Household.address$": { [Op.iLike]: `%${search}%` } },
            { "$FeeCampaign.FeeType.fee_name$": { [Op.iLike]: `%${search}%` } },
            { "$Resident.full_name$": { [Op.iLike]: `%${search}%` } },
        ];
    }

    if (household_id) {
        whereClause.household_id = household_id;
    }

    if (fee_campaign_id) {
        whereClause.fee_campaign_id = fee_campaign_id;
    }

    if (payment_status) {
        whereClause.payment_status = payment_status;
    }

    // Set up include options
    const includeOptions = [
        {
            model: FeeCampaign,
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
        },
        {
            model: Household,
            attributes: [
                "id",
                "apartment_code",
                "owner_name",
                "address",
                "phone_number",
            ],
        },
        {
            model: Resident,
            attributes: ["id", "full_name", "identity_number"],
        },
    ];

    // Build base query options
    const queryOptions = {
        where: whereClause,
        include: includeOptions,
        order: [["created_at", "DESC"]],
        distinct: true,
    };

    // Apply pagination if specified
    if (page !== null && per_page !== null) {
        const offset = (page - 1) * per_page;
        queryOptions.offset = offset;
        queryOptions.limit = per_page;

        const { count, rows } = await HouseholdFeeAssignment.findAndCountAll(
            queryOptions
        );

        return {
            data: rows,
            total: count,
        };
    } else {
        // No pagination - fetch all records
        const householdFeeAssignments = await HouseholdFeeAssignment.findAll(
            queryOptions
        );

        return {
            data: householdFeeAssignments,
            total: householdFeeAssignments.length,
        };
    }
};

exports.getHouseholdFeeAssignmentById = async (id) => {
    return await HouseholdFeeAssignment.findByPk(id, {
        include: [
            {
                model: FeeCampaign,
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
            },
            {
                model: Household,
                attributes: [
                    "id",
                    "apartment_code",
                    "owner_name",
                    "address",
                    "phone_number",
                ],
            },
            {
                model: Resident,
                attributes: ["id", "full_name", "identity_number"],
            },
        ],
    });
};

exports.createHouseholdFeeAssignment = async (assignmentData) => {
    const {
        fee_campaign_id,
        household_id,
        amount_due,
        amount_paid,
        payment_date,
        paid_by,
        payment_status,
    } = assignmentData;

    const newAssignment = await HouseholdFeeAssignment.create({
        fee_campaign_id,
        household_id,
        amount_due,
        amount_paid: amount_paid || 0,
        payment_date,
        paid_by,
        payment_status,
    });

    return await this.getHouseholdFeeAssignmentById(newAssignment.id);
};

exports.updateHouseholdFeeAssignment = async (id, assignmentData) => {
    const assignment = await HouseholdFeeAssignment.findByPk(id);

    if (!assignment) {
        return null;
    }

    await assignment.update({
        fee_campaign_id:
            assignmentData.fee_campaign_id || assignment.fee_campaign_id,
        household_id: assignmentData.household_id || assignment.household_id,
        amount_due:
            assignmentData.amount_due !== undefined
                ? assignmentData.amount_due
                : assignment.amount_due,
        amount_paid:
            assignmentData.amount_paid !== undefined
                ? assignmentData.amount_paid
                : assignment.amount_paid,
        payment_date: assignmentData.payment_date || assignment.payment_date,
        paid_by: assignmentData.paid_by || assignment.paid_by,
        payment_status:
            assignmentData.payment_status !== undefined
                ? assignmentData.payment_status
                : assignment.payment_status,
    });

    return await this.getHouseholdFeeAssignmentById(id);
};

exports.deleteHouseholdFeeAssignment = async (id) => {
    const assignment = await HouseholdFeeAssignment.findByPk(id);

    if (!assignment) {
        return false;
    }

    await assignment.destroy();

    return true;
};
