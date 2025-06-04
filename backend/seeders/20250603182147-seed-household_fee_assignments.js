"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert(
            "household_fee_assignments",
            [
                {
                    id: 1,
                    campaign_id: 1,
                    household_id: 1,
                    amount_due: 150000,
                    amount_paid: 0,
                    payment_date: null,
                    paid_by: null,
                    payment_status: 1,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 2,
                    campaign_id: 2,
                    household_id: 1,
                    amount_due: 70000,
                    amount_paid: 70000,
                    payment_date: "2024-01-05",
                    paid_by: 2,
                    payment_status: 2,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 3,
                    campaign_id: 3,
                    household_id: 2,
                    amount_due: 70000,
                    amount_paid: 70000,
                    payment_date: "2024-01-06",
                    paid_by: 3,
                    payment_status: 2,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 4,
                    campaign_id: 4,
                    household_id: 3,
                    amount_due: 1200000,
                    amount_paid: 0,
                    payment_date: null,
                    paid_by: null,
                    payment_status: 1,
                    created_at: now,
                    updated_at: now,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("household_fee_assignments", null, {});
    },
};
