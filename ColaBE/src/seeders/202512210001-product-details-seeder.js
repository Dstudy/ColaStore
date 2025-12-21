"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Product details for drink products
        const productDetails = [
            // Cola Classic 330ml (productId: 1)
            {
                productId: 1,
                serving_size: "330ml (1 can)",
                energy_kcal: 139.0,
                protein: 0.0,
                fat: 0.0,
                carbohydrates: 35.0,
                sugars: 35.0,
                fiber: 0.0,
                ingredient:
                    "Carbonated water, sugar, caramel color (E150d), phosphoric acid, natural flavors, caffeine",
                createdAt: now,
                updatedAt: now,
            },
            // Orange Soda 500ml (productId: 2)
            {
                productId: 2,
                serving_size: "500ml (1 bottle)",
                energy_kcal: 210.0,
                protein: 0.0,
                fat: 0.0,
                carbohydrates: 53.0,
                sugars: 52.0,
                fiber: 0.0,
                ingredient:
                    "Carbonated water, high fructose corn syrup, citric acid, natural orange flavor, sodium benzoate (preservative), yellow 6, brominated vegetable oil",
                createdAt: now,
                updatedAt: now,
            },
        ];

        await queryInterface.bulkInsert("product_details", productDetails, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("product_details", null, {});
    },
};
