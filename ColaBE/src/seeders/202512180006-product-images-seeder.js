"use strict";

const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Read products from JSON file
    const productsJsonPath = path.join(__dirname, "../../products.json");
    const productsData = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));

    for (const product of productsData) {
      // Find product id by name
      const prodRows = await queryInterface.sequelize.query(
        "SELECT id FROM products WHERE name = :name LIMIT 1",
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { name: product.productName },
        }
      );

      if (!prodRows || !prodRows[0]) {
        console.warn(`Product not found: ${product.productName}`);
        continue;
      }

      const productId = prodRows[0].id;

      // Use imageUrl from JSON if available
      if (product.imageUrl) {
        const imageRow = {
          product_id: productId,
          pic_url: product.imageUrl,
          display_order: 1,
        };

        // Check if image already exists to avoid duplicates
        const existing = await queryInterface.sequelize.query(
          "SELECT id FROM product_images WHERE product_id = :pid AND pic_url = :url LIMIT 1",
          {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { pid: imageRow.product_id, url: imageRow.pic_url },
          }
        );

        if (!existing || !existing[0]) {
          await queryInterface.bulkInsert("product_images", [imageRow], {});
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product_images", null, {});
  },
};

