const e = require("express");

/**
 * Format household data for API responses
 *
 * @param {Object} household - Household model instance
 * @returns {Object} - Formatted household data
 */
module.exports = (household) => {
    const formattedHousehold = {
        id: household.id,
        owner_name: household.owner_name,
        apartment_code: household.apartment_code,
        floor_area: household.floor_area,
        address: household.address,
        phone_number: household.phone_number,
        created_at: household.created_at,
        updated_at: household.updated_at,
    };

    if (household.Residents && Array.isArray(household.Residents)) {
        formattedHousehold.residents = household.Residents.map((resident) => ({
            id: resident.id,
            full_name: resident.full_name,
            phone_number: resident.phone_number,
            birth_date: resident.birth_date,
            birth_place: resident.birth_place,
            ethnicity: resident.ethnicity,
            occupation: resident.occupation,
            workplace: resident.workplace,
            identity_number: resident.identity_number,
            issue_date: resident.issue_date,
            issue_place: resident.issue_place,
            status: resident.status,
            gender: resident.gender,
        }));
    }

    return formattedHousehold;
};
