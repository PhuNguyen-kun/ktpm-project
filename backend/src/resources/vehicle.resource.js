const vehicleResource = (vehicle) => {
    const formattedVehicle = {
        id: vehicle.id,
        household_id: vehicle.household_id,
        type: vehicle.type,
        plate_number: vehicle.plate_number,
        registered_date: vehicle.registered_date,
        created_at: vehicle.created_at,
        updated_at: vehicle.updated_at,
    };

    if (vehicle.Household) {
        formattedVehicle.household = {
            id: vehicle.Household.id,
            owner_name: vehicle.Household.owner_name,
            apartment_code: vehicle.Household.apartment_code,
            address: vehicle.Household.address,
            phone_number: vehicle.Household.phone_number,
        };
    }

    return formattedVehicle;
};

module.exports = vehicleResource;
