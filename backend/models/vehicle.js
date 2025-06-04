"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Vehicle extends Model {
        static associate(models) {
            Vehicle.belongsTo(models.Household, { foreignKey: "household_id" });
        }
    }
    Vehicle.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            household_id: DataTypes.BIGINT,
            type: {
                type: DataTypes.SMALLINT,
                comment: "1 xe máy, 2 ô tô",
            },
            plate_number: DataTypes.STRING,
            registered_date: DataTypes.DATEONLY,
        },
        {
            sequelize,
            modelName: "Vehicle",
            tableName: "vehicles",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return Vehicle;
};
