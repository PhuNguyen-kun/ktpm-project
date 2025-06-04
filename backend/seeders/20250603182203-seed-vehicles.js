"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert(
            "vehicles",
            [
                {
                    id: 1,
                    household_id: 1,
                    type: 1,
                    plate_number: "29A-12345",
                    registered_date: "2023-06-01",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 2,
                    household_id: 2,
                    type: 1,
                    plate_number: "30B-54321",
                    registered_date: "2023-06-02",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 3,
                    household_id: 3,
                    type: 1,
                    plate_number: "31C-11223",
                    registered_date: "2023-06-03",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 4,
                    household_id: 4,
                    type: 1,
                    plate_number: "32D-44556",
                    registered_date: "2023-06-04",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 5,
                    household_id: 5,
                    type: 1,
                    plate_number: "33E-77889",
                    registered_date: "2023-06-05",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 6,
                    household_id: 6,
                    type: 2,
                    plate_number: "HN-123456",
                    registered_date: "2023-06-01",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 7,
                    household_id: 7,
                    type: 2,
                    plate_number: "HN-654321",
                    registered_date: "2023-06-02",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 8,
                    household_id: 8,
                    type: 2,
                    plate_number: "HN-112233",
                    registered_date: "2023-06-03",
                    created_at: now,
                    updated_at: now,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("vehicles", null, {});
    },
};
