"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert(
            "resident_change_logs",
            [
                {
                    id: 1,
                    resident_id: 1,
                    change_type: 1,
                    change_date: "2000-01-01",
                    note: "Thêm nhân khẩu mới",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 2,
                    resident_id: 2,
                    change_type: 1,
                    change_date: "2002-03-01",
                    note: "Thêm nhân khẩu mới",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 3,
                    resident_id: 3,
                    change_type: 2,
                    change_date: "2010-05-20",
                    note: "Đăng ký tạm trú",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 4,
                    resident_id: 4,
                    change_type: 3,
                    change_date: "2015-08-10",
                    note: "Chuyển đi",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 5,
                    resident_id: 5,
                    change_type: 1,
                    change_date: "2005-11-01",
                    note: "Thêm nhân khẩu mới",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 6,
                    resident_id: 6,
                    change_type: 2,
                    change_date: "2012-07-12",
                    note: "Đăng ký tạm trú",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 7,
                    resident_id: 7,
                    change_type: 3,
                    change_date: "2018-01-30",
                    note: "Chuyển đi",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 8,
                    resident_id: 8,
                    change_type: 1,
                    change_date: "2008-09-15",
                    note: "Thêm nhân khẩu mới",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 9,
                    resident_id: 9,
                    change_type: 2,
                    change_date: "2014-04-23",
                    note: "Đăng ký tạm trú",
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 10,
                    resident_id: 10,
                    change_type: 3,
                    change_date: "2019-12-10",
                    note: "Chuyển đi",
                    created_at: now,
                    updated_at: now,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("resident_change_logs", null, {});
    },
};
