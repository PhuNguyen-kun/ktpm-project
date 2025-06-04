"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const hashed_pwd =
            "$2y$12$a1jZ.GtIsbJYKhdpgpyU7eiVwYZwsByvj0BPR9ZdGso22qlMNx9iu";

        await queryInterface.bulkInsert(
            "users",
            [
                {
                    id: 1,
                    full_name: "Le Van Quan",
                    email: "leader1@gmail.com",
                    password: hashed_pwd,
                    role: 1,
                    google_id: null,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 2,
                    full_name: "Pham Thi Hoa",
                    email: "leader2@gmail.com",
                    password: hashed_pwd,
                    role: 1,
                    google_id: null,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 3,
                    full_name: "Nguyen Van Binh",
                    email: "accountant1@gmail.com",
                    password: hashed_pwd,
                    role: 2,
                    google_id: null,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 4,
                    full_name: "Tran Thi Lan",
                    email: "accountant2@gmail.com",
                    password: hashed_pwd,
                    role: 2,
                    google_id: null,
                    created_at: now,
                    updated_at: now,
                },
                {
                    id: 5,
                    full_name: "Hoang Van Huy",
                    email: "accountant3@gmail.com",
                    password: hashed_pwd,
                    role: 2,
                    google_id: null,
                    created_at: now,
                    updated_at: now,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    },
};
