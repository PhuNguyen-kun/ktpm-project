"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class HouseholdFeeAssignment extends Model {
        static associate(models) {
            HouseholdFeeAssignment.belongsTo(models.FeeCampaign, {
                foreignKey: "fee_campaign_id",
            });
            HouseholdFeeAssignment.belongsTo(models.Household, {
                foreignKey: "household_id",
            });
            HouseholdFeeAssignment.belongsTo(models.Resident, {
                foreignKey: "paid_by",
            });
        }
    }
    HouseholdFeeAssignment.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            fee_campaign_id: DataTypes.BIGINT,
            household_id: DataTypes.BIGINT,
            amount_due: DataTypes.DECIMAL(15, 2),
            amount_paid: DataTypes.DECIMAL(15, 2),
            payment_date: DataTypes.DATEONLY,
            paid_by: DataTypes.BIGINT,
            payment_status: {
                type: DataTypes.SMALLINT,
                comment: "1 unpaid, 2 paid, 3 partial",
            },
        },
        {
            sequelize,
            modelName: "HouseholdFeeAssignment",
            tableName: "household_fee_assignments",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return HouseholdFeeAssignment;
};
