"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.HouseholdFeeAssignment, {
                foreignKey: "paid_by",
            });
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            full_name: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                unique: true,
            },
            password: DataTypes.STRING,
            role: {
                type: DataTypes.SMALLINT,
                comment: "1: leader, 2: accountant",
            },
            google_id: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            underscored: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );
    return User;
};
