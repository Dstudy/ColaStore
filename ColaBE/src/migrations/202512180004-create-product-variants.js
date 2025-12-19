"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_variants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      size_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Nullable to support products without sizes (e.g., accessories, one-size items)
        references: { model: "sizes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // When a size is deleted, set size_id to NULL instead of restricting
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("product_variants", ["product_id"]);
    await queryInterface.addIndex("product_variants", ["size_id"]);
    
    // Unique constraint: one variant per (product_id, size_id) combination
    // Note: MySQL allows multiple NULL values in unique constraints, so multiple
    // variants with NULL size_id per product are allowed. If you need to enforce
    // only ONE NULL variant per product, use application-level validation or a
    // unique partial index (MySQL 8.0.13+)
    await queryInterface.addConstraint("product_variants", {
      fields: ["product_id", "size_id"],
      type: "unique",
      name: "uniq_product_variant_product_size",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_variants");
  },
};


