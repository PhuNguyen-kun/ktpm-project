const { Vehicle, Household, sequelize } = require("../../models");
const { Op } = require("sequelize");

exports.getAllVehicles = async ({
    page = null,
    per_page = null,
    search = null,
    household_id = null,
    type = null,
}) => {
    // Build where clause
    const whereClause = {};

    if (search) {
        whereClause[Op.or] = [{ plate_number: { [Op.iLike]: `%${search}%` } }];
    }

    if (household_id) {
        whereClause.household_id = household_id;
    }

    if (type) {
        whereClause.type = type;
    }

    // Set up include options for household data
    const includeOptions = [
        {
            model: Household,
            attributes: [
                "id",
                "owner_name",
                "apartment_code",
                "address",
                "phone_number",
            ],
        },
    ];

    // Build base query options
    const queryOptions = {
        where: whereClause,
        include: includeOptions,
        order: [["id", "DESC"]],
        distinct: true,
    };

    // Apply pagination if specified
    if (page !== null && per_page !== null) {
        const offset = (page - 1) * per_page;
        queryOptions.offset = offset;
        queryOptions.limit = per_page;

        const { count, rows } = await Vehicle.findAndCountAll(queryOptions);

        return {
            data: rows,
            total: count,
        };
    } else {
        // No pagination - fetch all records
        const vehicles = await Vehicle.findAll(queryOptions);

        return {
            data: vehicles,
            total: vehicles.length,
        };
    }
};

exports.getVehicleById = async (id) => {
    return await Vehicle.findByPk(id, {
        include: [
            {
                model: Household,
                attributes: [
                    "id",
                    "owner_name",
                    "apartment_code",
                    "address",
                    "phone_number",
                ],
            },
        ],
    });
};

exports.createVehicle = async (vehicleData) => {
    const { household_id, type, plate_number, registered_date } = vehicleData;

    return await Vehicle.create({
        household_id,
        type,
        plate_number,
        registered_date,
    });
};

exports.updateVehicle = async (id, vehicleData) => {
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
        return null;
    }

    await vehicle.update({
        household_id: vehicleData.household_id || vehicle.household_id,
        type: vehicleData.type || vehicle.type,
        plate_number: vehicleData.plate_number || vehicle.plate_number,
        registered_date: vehicleData.registered_date || vehicle.registered_date,
    });

    return await this.getVehicleById(id);
};

exports.deleteVehicle = async (id) => {
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
        return false;
    }

    await vehicle.destroy();

    return true;
};
