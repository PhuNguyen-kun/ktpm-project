const feeTypeResource = (feeType) => {
    return {
        id: feeType.id,
        fee_name: feeType.fee_name,
        description: feeType.description,
        is_mandatory: feeType.is_mandatory,
        calculation_method: feeType.calculation_method,
        default_amount: feeType.default_amount,
        created_at: feeType.created_at,
        updated_at: feeType.updated_at,
    };
};

module.exports = feeTypeResource;
