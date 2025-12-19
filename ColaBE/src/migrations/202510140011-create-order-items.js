"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "orders", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      quantity: { type: Sequelize.INTEGER },
      price_at_purchase: { type: Sequelize.DECIMAL(10, 2) },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_items");
  },
};
