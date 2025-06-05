const householdFeeAssignmentResource = (householdFeeAssignment) => {
    const formattedAssignment = {
        id: householdFeeAssignment.id,
        fee_campaign_id: householdFeeAssignment.fee_campaign_id,
        household_id: householdFeeAssignment.household_id,
        amount_due: householdFeeAssignment.amount_due,
        amount_paid: householdFeeAssignment.amount_paid,
        payment_date: householdFeeAssignment.payment_date,
        paid_by: householdFeeAssignment.paid_by,
        payment_status: householdFeeAssignment.payment_status,
        created_at: householdFeeAssignment.created_at,
        updated_at: householdFeeAssignment.updated_at,
    };

    if (householdFeeAssignment.FeeCampaign) {
        formattedAssignment.fee_campaign = {
            id: householdFeeAssignment.FeeCampaign.id,
            fee_type_id: householdFeeAssignment.FeeCampaign.fee_type_id,
            start_date: householdFeeAssignment.FeeCampaign.start_date,
            end_date: householdFeeAssignment.FeeCampaign.end_date,
            note: householdFeeAssignment.FeeCampaign.note,
        };

        if (householdFeeAssignment.FeeCampaign.FeeType) {
            formattedAssignment.fee_campaign.fee_type = {
                id: householdFeeAssignment.FeeCampaign.FeeType.id,
                fee_name: householdFeeAssignment.FeeCampaign.FeeType.fee_name,
                description:
                    householdFeeAssignment.FeeCampaign.FeeType.description,
                is_mandatory:
                    householdFeeAssignment.FeeCampaign.FeeType.is_mandatory,
                unit: householdFeeAssignment.FeeCampaign.FeeType.unit,
                calculation_method:
                    householdFeeAssignment.FeeCampaign.FeeType
                        .calculation_method,
                default_amount:
                    householdFeeAssignment.FeeCampaign.FeeType.default_amount,
            };
        }
    }

    if (householdFeeAssignment.Household) {
        formattedAssignment.household = {
            id: householdFeeAssignment.Household.id,
            owner_name: householdFeeAssignment.Household.owner_name,
            apartment_code: householdFeeAssignment.Household.apartment_code,
            address: householdFeeAssignment.Household.address,
            phone_number: householdFeeAssignment.Household.phone_number,
        };
    }

    if (householdFeeAssignment.Resident) {
        formattedAssignment.paid_by_resident = {
            id: householdFeeAssignment.Resident.id,
            full_name: householdFeeAssignment.Resident.full_name,
            identity_number: householdFeeAssignment.Resident.identity_number,
        };
    }

    return formattedAssignment;
};

module.exports = householdFeeAssignmentResource;
