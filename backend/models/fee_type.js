"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class FeeType extends Model {
        static associate(models) {
            FeeType.hasMany(models.FeeCampaign, { foreignKey: "fee_type_id" });
        }
    }
    FeeType.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            fee_name: DataTypes.STRING,
            description: DataTypes.TEXT,
            is_mandatory: DataTypes.BOOLEAN,
            calculation_method: {
                type: DataTypes.SMALLINT,
                comment: "1 fixed, 2 per_m2, 3 per_person, 4 per_vehicle",
            },
            default_amount: DataTypes.DECIMAL(15, 2),
        },
        {
            sequelize,
            modelName: "FeeType",
            tableName: "fee_types",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return FeeType;
};
