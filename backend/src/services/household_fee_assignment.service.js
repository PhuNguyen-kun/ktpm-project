const {
    HouseholdFeeAssignment,
    FeeCampaign,
    FeeType,
    Household,
    Resident,
    Vehicle,
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

/**
 * Batch create household fee assignments based on fee campaign and household selection
 * The fee amount is calculated based on the fee type's calculation method
 */
exports.batchCreateHouseholdFeeAssignments = async ({
    fee_campaign_id,
    household_ids = [],
}) => {
    // Start a transaction for data consistency
    const transaction = await sequelize.transaction();

    try {
        // Get the fee campaign details with its fee type
        const feeCampaign = await FeeCampaign.findByPk(fee_campaign_id, {
            include: [{ model: FeeType }],
            transaction,
        });

        if (!feeCampaign) {
            await transaction.rollback();
            throw new Error("Fee campaign not found");
        }

        const feeType = feeCampaign.FeeType;
        const calculationMethod = feeType.calculation_method;
        const defaultAmount = parseFloat(feeType.default_amount);

        // Get all households to process or use the selected ones
        let householdsQuery = {};
        if (household_ids && household_ids.length > 0) {
            householdsQuery = { id: { [Op.in]: household_ids } };
        }

        const households = await Household.findAll({
            where: householdsQuery,
            transaction,
        });

        if (!households.length) {
            await transaction.rollback();
            throw new Error("No households found to process");
        }

        // Final results array
        const results = [];

        // Process each household
        for (const household of households) {
            let amountDue = defaultAmount;

            // Calculate amount based on the fee type's calculation method
            switch (calculationMethod) {
                case 1: // fixed fee
                    // Use default amount directly
                    break;

                case 2: // per square meter
                    const floorArea = parseFloat(household.floor_area || 0);
                    amountDue = defaultAmount * floorArea;
                    break;

                case 3: // per person
                    // Count the number of permanent and temporary residents
                    const residentCount = await Resident.count({
                        where: {
                            household_id: household.id,
                            status: { [Op.in]: [1, 2] }, // 1: permanent, 2: temporary
                        },
                        transaction,
                    });
                    amountDue = defaultAmount * residentCount;
                    break;

                case 4: // per vehicle
                    // Count the number of vehicles
                    const vehicleCount = await Vehicle.count({
                        where: { household_id: household.id },
                        transaction,
                    });
                    amountDue = defaultAmount * vehicleCount;
                    break;

                default:
                    // Use the default amount if calculation method is not recognized
                    break;
            }

            // Check if an assignment already exists for this household and fee campaign
            const existingAssignment = await HouseholdFeeAssignment.findOne({
                where: {
                    household_id: household.id,
                    fee_campaign_id: fee_campaign_id,
                },
                transaction,
            });

            // Don't create duplicates, but return existing ones in the results
            if (existingAssignment) {
                results.push(existingAssignment);
                continue;
            }

            // Create the new assignment with the calculated amount
            const newAssignment = await HouseholdFeeAssignment.create(
                {
                    fee_campaign_id,
                    household_id: household.id,
                    amount_due: amountDue,
                    amount_paid: 0, // Initially not paid
                    payment_status: 1, // 1 unpaid
                },
                { transaction }
            );

            results.push(newAssignment);
        }

        // Commit the transaction
        await transaction.commit();

        // Get full details of all created assignments
        const assignmentIds = results.map((assignment) => assignment.id);

        const createdAssignments = await HouseholdFeeAssignment.findAll({
            where: { id: { [Op.in]: assignmentIds } },
            include: [
                {
                    model: FeeCampaign,
                    include: [{ model: FeeType }],
                },
                {
                    model: Household,
                },
            ],
        });

        return {
            count: createdAssignments.length,
            data: createdAssignments,
        };
    } catch (error) {
        // Rollback the transaction if any error occurs
        if (transaction) await transaction.rollback();
        throw error;
    }
};
