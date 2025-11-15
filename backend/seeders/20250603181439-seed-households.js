"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const households = [];
        for (let i = 1; i <= 15; i++) {
            households.push({
                id: i,
                owner_name: `Chủ hộ ${i}`,
                apartment_code: `B3-${200 + i}`,
                floor_area: (50 + i * 5).toFixed(2), // Diện tích từ 55.00 đến 100.00 m²
                address: `Tòa B3, Tầng 20, Căn hộ ${200 + i}`,
                phone_number: `09876543${(10 + i).toString().padStart(3, "0")}`,
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
