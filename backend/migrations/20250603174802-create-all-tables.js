"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("households", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            owner_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            apartment_code: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            floor_area: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("residents", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            household_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: "households", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            full_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            birth_place: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            ethnicity: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            occupation: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            workplace: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            identity_number: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            issue_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            issue_place: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            status: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                defaultValue: 1,
                comment: "1: thường trú, 2: tạm trú, 3: chuyển đi",
            },
            gender: {
                type: Sequelize.SMALLINT,
                allowNull: true,
                comment: "1: male, 2: female",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            full_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            role: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                comment: "1: leader, 2: accountant",
            },
            google_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("fee_types", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            fee_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_mandatory: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            calculation_method: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                comment: "1: fixed, 2: per_m2, 3: per_person, 4: per_vehicle",
            },
            default_amount: {
                type: Sequelize.DECIMAL(15, 0),
                allowNull: false,
                defaultValue: 0,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("fee_campaigns", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            fee_type_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: "fee_types", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            note: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("household_fee_assignments", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            fee_campaign_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: "fee_campaigns", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            household_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: "households", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            amount_due: {
                type: Sequelize.DECIMAL(15, 0),
                allowNull: false,
            },
            amount_paid: {
                type: Sequelize.DECIMAL(15, 0),
                allowNull: false,
                defaultValue: 0,
            },
            payment_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            paid_by: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: { model: "residents", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            payment_status: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                defaultValue: 1,
                comment: "1 unpaid, 2 paid, 3 partial",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("vehicles", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            household_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: "households", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            type: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                comment: "1 xe máy, 2 ô tô",
            },
            plate_number: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            registered_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("utility_bills", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            household_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: "households", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            service_type: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                comment: "1 điện, 2 nước, 3 internet",
            },
            billing_month: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(15, 0),
                allowNull: false,
            },
            paid: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            paid_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.createTable("resident_change_logs", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            resident_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: "residents", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            change_type: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                comment: "1 thêm mới, 2 tạm trú, 3 chuyển đi",
            },
            change_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            note: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("resident_change_logs");
        await queryInterface.dropTable("utility_bills");
        await queryInterface.dropTable("vehicles");
        await queryInterface.dropTable("household_fee_assignments");
        await queryInterface.dropTable("fee_campaigns");
        await queryInterface.dropTable("fee_types");
        await queryInterface.dropTable("users");
        await queryInterface.dropTable("residents");
        await queryInterface.dropTable("households");
    },
};
