const {
    Resident,
    Household,
    ResidentChangeLog,
    sequelize,
} = require("../../models");
const { Op } = require("sequelize");

exports.getAllResidents = async ({
    page,
    per_page,
    search,
    household_id,
    status,
}) => {
    const offset = (page - 1) * per_page;

    const whereClause = {};

    if (search) {
        whereClause[Op.or] = [
            { full_name: { [Op.iLike]: `%${search}%` } },
            { identity_number: { [Op.like]: `%${search}%` } },
            { phone_number: { [Op.like]: `%${search}%` } },
        ];
    }

    if (household_id) {
        whereClause.household_id = household_id;
    }

    if (status) {
        whereClause.status = status;
    }

    const { count, rows } = await Resident.findAndCountAll({
        where: whereClause,
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
        offset,
        limit: per_page,
        order: [["id", "DESC"]],
        distinct: true,
    });

    return {
        data: rows,
        total: count,
        page,
        per_page,
    };
};

exports.getResidentById = async (id, include_logs = false) => {
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

    if (include_logs === true) {
        includeOptions.push({
            model: ResidentChangeLog,
            attributes: [
                "id",
                "change_type",
                "change_date",
                "note",
                "created_at",
            ],
        });
    }

    const resident = await Resident.findByPk(id, {
        include: includeOptions,
    });

    return resident;
};

exports.createResident = async (residentData) => {
    const transaction = await sequelize.transaction();

    try {
        const resident = await Resident.create(residentData, { transaction });

        if (residentData.change_log) {
            await ResidentChangeLog.create(
                {
                    resident_id: resident.id,
                    change_type: residentData.change_log.change_type || 1,
                    change_date:
                        residentData.change_log.change_date || new Date(),
                    note: residentData.change_log.note,
                },
                { transaction }
            );
        }

        await transaction.commit();

        return await this.getResidentById(resident.id, true);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.updateResident = async (id, residentData) => {
    const transaction = await sequelize.transaction();

    try {
        const resident = await Resident.findByPk(id);

        if (!resident) {
            await transaction.rollback();
            return null;
        }

        await resident.update(residentData, { transaction });

        if (residentData.change_log) {
            await ResidentChangeLog.create(
                {
                    resident_id: resident.id,
                    change_type: residentData.change_log.change_type,
                    change_date:
                        residentData.change_log.change_date || new Date(),
                    note: residentData.change_log.note,
                },
                { transaction }
            );
        }

        await transaction.commit();

        return await this.getResidentById(id, true);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.deleteResident = async (id) => {
    const resident = await Resident.findByPk(id);

    if (!resident) {
        return null;
    }

    await resident.destroy();
    return resident;
};
