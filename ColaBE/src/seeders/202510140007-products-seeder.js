"use strict";

const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Read products from JSON file
    const productsJsonPath = path.join(__dirname, "../../products.json");
    const productsData = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));

    // Product type mapping: type name -> ID
    const productTypeMap = {
      can: 1,
      bottle: 2,
      clothes: 3,
      goods: 4,
      gift: 5,
    };

    // Map JSON products to database schema
    const rows = productsData.map((product) => {
      const productType = product.type ? product.type.toLowerCase() : "goods";
      const productTypeId = productTypeMap[productType] || 4; // default to goods

      // Clothes typically have sizes
      const hasSize = productType === "clothes";

      return {
        name: product.productName,
        subtitle: product.subtitle || null,
        description: product.description || null,
        price: parseFloat(product.price) || 0,
        hasSize: hasSize,
        isFeatured: false,
        active: true,
        productTypeId: productTypeId,
        createdAt: now,
        updatedAt: now,
      };
    });

    await queryInterface.bulkInsert("products", rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("product_variants", null, {});
    await queryInterface.bulkDelete("products", null, {});
  },
};
