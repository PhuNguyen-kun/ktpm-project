"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Household extends Model {
        static associate(models) {
            Household.hasMany(models.Resident, { foreignKey: "household_id" });
            Household.hasMany(models.HouseholdFeeAssignment, {
                foreignKey: "household_id",
            });
            Household.hasMany(models.Vehicle, { foreignKey: "household_id" });
            Household.hasMany(models.UtilityBill, {
                foreignKey: "household_id",
            });
        }
    }
    Household.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            owner_name: DataTypes.STRING,
            apartment_code: DataTypes.STRING,
            address: DataTypes.STRING,
            phone_number: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Household",
            tableName: "households",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return Household;
};
