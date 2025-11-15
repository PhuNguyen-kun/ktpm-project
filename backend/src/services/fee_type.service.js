const { FeeType, sequelize } = require("../../models");
const { Op } = require("sequelize");

exports.getAllFeeTypes = async ({
    page = null,
    per_page = null,
    search = null,
    is_mandatory = null,
}) => {
    // Build where clause
    const whereClause = {};

    if (search) {
        whereClause[Op.or] = [
            { fee_name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
        ];
    }

    if (is_mandatory !== null) {
        whereClause.is_mandatory = is_mandatory;
    }

    // Build base query options
    const queryOptions = {
        where: whereClause,
        order: [["id", "DESC"]],
    };

    // Apply pagination if specified
    if (page !== null && per_page !== null) {
        const offset = (page - 1) * per_page;
        queryOptions.offset = offset;
        queryOptions.limit = per_page;

        const { count, rows } = await FeeType.findAndCountAll(queryOptions);

        return {
            data: rows,
            total: count,
        };
    } else {
        // No pagination - fetch all records
        const feeTypes = await FeeType.findAll(queryOptions);

        return {
            data: feeTypes,
            total: feeTypes.length,
        };
    }
};

exports.getFeeTypeById = async (id) => {
    return await FeeType.findByPk(id);
};

exports.createFeeType = async (feeTypeData) => {
    const {
        fee_name,
        description,
        is_mandatory,
        calculation_method,
        default_amount,
    } = feeTypeData;

    return await FeeType.create({
        fee_name,
        description,
        is_mandatory,
        calculation_method,
        default_amount,
    });
};

exports.updateFeeType = async (id, feeTypeData) => {
    const feeType = await FeeType.findByPk(id);

    if (!feeType) {
        return null;
    }

    await feeType.update({
        fee_name: feeTypeData.fee_name || feeType.fee_name,
        description: feeTypeData.description || feeType.description,
        is_mandatory:
            feeTypeData.is_mandatory !== undefined
                ? feeTypeData.is_mandatory
                : feeType.is_mandatory,
        calculation_method:
            feeTypeData.calculation_method || feeType.calculation_method,
        default_amount: feeTypeData.default_amount || feeType.default_amount,
    });

    return await this.getFeeTypeById(id);
};

exports.deleteFeeType = async (id) => {
    const feeType = await FeeType.findByPk(id);

    if (!feeType) {
        return false;
    }

    await feeType.destroy();

    return true;
};
