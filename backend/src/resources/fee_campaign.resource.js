const feeCampaignResource = (feeCampaign) => {
    const formattedFeeCampaign = {
        id: feeCampaign.id,
        fee_type_id: feeCampaign.fee_type_id,
        start_date: feeCampaign.start_date,
        end_date: feeCampaign.end_date,
        note: feeCampaign.note,
        created_at: feeCampaign.created_at,
        updated_at: feeCampaign.updated_at,
    };

    if (feeCampaign.FeeType) {
        formattedFeeCampaign.fee_type = {
            id: feeCampaign.FeeType.id,
            fee_name: feeCampaign.FeeType.fee_name,
            description: feeCampaign.FeeType.description,
            is_mandatory: feeCampaign.FeeType.is_mandatory,
            unit: feeCampaign.FeeType.unit,
            calculation_method: feeCampaign.FeeType.calculation_method,
            default_amount: feeCampaign.FeeType.default_amount,
        };
    }

    return formattedFeeCampaign;
};

module.exports = feeCampaignResource;
