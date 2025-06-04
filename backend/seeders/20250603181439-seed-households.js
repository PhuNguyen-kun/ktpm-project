"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const households = [];
        for (let i = 1; i <= 15; i++) {
            households.push({
                id: i,
                owner_name: `Chu hộ ${i}`,
                apartment_code: `B3-${200 + i}`,
                address: `Block B3, Floor 20, Apartment ${200 + i}`,
                phone_number: `09876543${(100 + i)
                    .toString()
                    .padStart(3, "0")}`,
                created_at: now,
                updated_at: now,
            });
        }
        await queryInterface.bulkInsert("households", households, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("households", null, {});
    },
};
