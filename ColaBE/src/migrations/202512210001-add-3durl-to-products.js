"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("products", "3DUrl", {
            type: Sequelize.STRING,
            allowNull: true,
            after: "description",
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("products", "3DUrl");
    },
};
