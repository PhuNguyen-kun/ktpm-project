"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class FeeCampaign extends Model {
        static associate(models) {
            FeeCampaign.belongsTo(models.FeeType, {
                foreignKey: "fee_type_id",
            });
            FeeCampaign.hasMany(models.HouseholdFeeAssignment, {
                foreignKey: "fee_campaign_id",
            });
        }
    }
    FeeCampaign.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            fee_type_id: DataTypes.BIGINT,
            start_date: DataTypes.DATEONLY,
            end_date: DataTypes.DATEONLY,
            note: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "FeeCampaign",
            tableName: "fee_campaigns",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return FeeCampaign;
};
