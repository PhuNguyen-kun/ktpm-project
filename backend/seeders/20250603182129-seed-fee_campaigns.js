"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert(
            "fee_campaigns",
            [
                {
                    id: 1,
                    fee_type_id: 1,
                    start_date: "2024-01-01",
                    end_date: "2024-01-31",
                    note: "Đợt thu phí dịch vụ tháng 1/2024",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 2,
                    fee_type_id: 2,
                    start_date: "2024-01-01",
                    end_date: "2024-01-31",
                    note: "Đợt thu phí quản lý tháng 1/2024",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 3,
                    fee_type_id: 3,
                    start_date: "2024-01-01",
                    end_date: "2024-01-31",
                    note: "Đợt thu phí gửi xe máy tháng 1/2024",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 4,
                    fee_type_id: 4,
                    start_date: "2024-01-01",
                    end_date: "2024-01-31",
                    note: "Đợt thu phí gửi ô tô tháng 1/2024",
                    created_at: now,
                    updated_at: now,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("fee_campaigns", null, {});
    },
};
