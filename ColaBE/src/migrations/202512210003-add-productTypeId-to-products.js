"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("products", "productTypeId", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "productTypes",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("products", "productTypeId");
    },
};
