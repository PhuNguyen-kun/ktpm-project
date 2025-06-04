"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ResidentChangeLog extends Model {
        static associate(models) {
            ResidentChangeLog.belongsTo(models.Resident, {
                foreignKey: "resident_id",
            });
        }
    }
    ResidentChangeLog.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            resident_id: DataTypes.BIGINT,
            change_type: {
                type: DataTypes.SMALLINT,
                comment: "1 thêm mới, 2 tạm trú, 3 chuyển đi",
            },
            change_date: DataTypes.DATEONLY,
            note: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "ResidentChangeLog",
            tableName: "resident_change_logs",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return ResidentChangeLog;
};
