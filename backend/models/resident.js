"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Resident extends Model {
        static associate(models) {
            Resident.belongsTo(models.Household, {
                foreignKey: "household_id",
            });
            Resident.hasMany(models.ResidentChangeLog, {
                foreignKey: "resident_id",
            });
        }
    }
    Resident.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            household_id: DataTypes.BIGINT,
            full_name: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            birth_date: DataTypes.DATEONLY,
            birth_place: DataTypes.STRING,
            ethnicity: DataTypes.STRING,
            occupation: DataTypes.STRING,
            workplace: DataTypes.STRING,
            identity_number: DataTypes.STRING,
            issue_date: DataTypes.DATEONLY,
            issue_place: DataTypes.STRING,
            status: {
                type: DataTypes.SMALLINT,
                comment: "1: thường trú, 2: tạm trú, 3: chuyển đi",
            },
            gender: {
                type: DataTypes.SMALLINT,
                comment: "1: male, 2: female",
            },
        },
        {
            sequelize,
            modelName: "Resident",
            tableName: "residents",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return Resident;
};
