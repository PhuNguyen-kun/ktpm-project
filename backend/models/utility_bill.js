"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UtilityBill extends Model {
        static associate(models) {
            UtilityBill.belongsTo(models.Household, {
                foreignKey: "household_id",
            });
        }
    }
    UtilityBill.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            household_id: DataTypes.BIGINT,
            service_type: {
                type: DataTypes.SMALLINT,
                comment: "1 điện, 2 nước, 3 internet",
            },
            billing_month: DataTypes.DATEONLY,
            amount: DataTypes.DECIMAL(15, 2),
            paid: DataTypes.BOOLEAN,
            paid_date: DataTypes.DATEONLY,
        },
        {
            sequelize,
            modelName: "UtilityBill",
            tableName: "utility_bills",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return UtilityBill;
};
