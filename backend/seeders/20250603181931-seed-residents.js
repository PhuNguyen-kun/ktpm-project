"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const residents = [];
        for (let i = 1; i <= 15; i++) {
            // Chủ hộ (male)
            residents.push({
                id: i * 2 - 1,
                household_id: i,
                full_name: `Nguyễn Chủ hộ ${i}`,
                phone_number: `090${100000 + i * 2 - 1}`,
                birth_date: `1980-0${(i % 9) + 1}-15`,
                birth_place: "Hanoi",
                ethnicity: "Kinh",
                occupation: "Công chức",
                workplace: "Cơ quan Nhà nước",
                identity_number: `ID${100000 + i * 2 - 1}`,
                issue_date: "2000-01-01",
                issue_place: "Hanoi",
                status: 1,
                gender: 1,
                created_at: now,
                updated_at: now,
            });
            // Vợ hoặc thành viên khác (female)
            residents.push({
                id: i * 2,
                household_id: i,
                full_name: `Nguyễn Thành viên ${i}`,
                phone_number: `090${100000 + i * 2 - 1}`,
                birth_date: `1982-0${(i % 9) + 1}-20`,
                birth_place: "Hanoi",
                ethnicity: "Kinh",
                occupation: "Giáo viên",
                workplace: "Trường học",
                identity_number: `ID${100000 + i * 2}`,
                issue_date: "2002-01-01",
                issue_place: "Hanoi",
                status: 1,
                gender: 2,
                created_at: now,
                updated_at: now,
            });
        }
        await queryInterface.bulkInsert("residents", residents, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("residents", null, {});
    },
};
