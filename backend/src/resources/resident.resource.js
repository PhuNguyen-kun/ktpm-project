const residentResource = (resident) => {
    const formattedResident = {
        id: resident.id,
        household_id: resident.household_id,
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
        created_at: resident.created_at,
        updated_at: resident.updated_at,
    };

    if (resident.Household) {
        formattedResident.household = {
            id: resident.Household.id,
            owner_name: resident.Household.owner_name,
            apartment_code: resident.Household.apartment_code,
            address: resident.Household.address,
            phone_number: resident.Household.phone_number,
        };
    }

    if (
        resident.ResidentChangeLogs &&
        Array.isArray(resident.ResidentChangeLogs)
    ) {
        formattedResident.change_logs = resident.ResidentChangeLogs.map(
            (log) => ({
                id: log.id,
                change_type: log.change_type,
                change_date: log.change_date,
                note: log.note,
                created_at: log.created_at,
            })
        );
    }

    return formattedResident;
};

module.exports = residentResource;
