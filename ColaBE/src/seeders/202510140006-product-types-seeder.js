"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const productTypes = [
            {
                name: "can",
                description: "Canned beverages and drinks",
                createdAt: now,
                updatedAt: now,
            },
            {
                name: "bottle",
                description: "Bottled beverages and drinks",
                createdAt: now,
                updatedAt: now,
            },
            {
                name: "clothes",
                description: "Clothing items and apparel",
                createdAt: now,
                updatedAt: now,
            },
            {
                name: "goods",
                description: "General merchandise and goods",
                createdAt: now,
                updatedAt: now,
            },
            {
                name: "gift",
                description: "Gift items and special products",
                createdAt: now,
                updatedAt: now,
            },
        ];

        await queryInterface.bulkInsert("productTypes", productTypes, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("productTypes", null, {});
    },
};
