"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add default values for timestamp fields
    await queryInterface.changeColumn("products", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    
    await queryInterface.changeColumn("products", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to original timestamp fields without defaults
    await queryInterface.changeColumn("products", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    
    await queryInterface.changeColumn("products", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};