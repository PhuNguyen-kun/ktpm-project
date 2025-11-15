"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert(
            "fee_types",
            [
                {
                    id: 1,
                    fee_name: "Phí dịch vụ chung cư",
                    description: "Phí vệ sinh, bảo trì khu chung cư",
                    is_mandatory: true,
                    calculation_method: 2,
                    default_amount: 500000,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 2,
                    fee_name: "Phí quản lý chung cư",
                    description: "Phí quản lý, vận hành tòa nhà",
                    is_mandatory: true,
                    calculation_method: 1,
                    default_amount: 700000,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 3,
                    fee_name: "Phí gửi xe máy",
                    description: "Phí gửi xe máy hàng tháng",
                    is_mandatory: false,
                    calculation_method: 1,
                    default_amount: 70000,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 4,
                    fee_name: "Phí gửi ô tô",
                    description: "Phí gửi ô tô hàng tháng",
                    is_mandatory: false,
                    calculation_method: 1,
                    default_amount: 1200000,
                    created_at: now,
                    updated_at: now,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("fee_types", null, {});
    },
};
