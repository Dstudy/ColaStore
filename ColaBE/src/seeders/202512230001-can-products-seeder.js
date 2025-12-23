"use strict";

const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Read can products from JSON file
    const canProductsJsonPath = path.join(__dirname, "../../can-products-seeder.json");
    const canProductsData = JSON.parse(fs.readFileSync(canProductsJsonPath, "utf8"));

    // Product type ID for 'can' (based on product-types-seeder.js)
    const canProductTypeId = 1;

    // Map JSON products to database schema for products table
    const productRows = canProductsData.map((product, index) => ({
      name: product.productName,
      subtitle: product.subtitle || null,
      description: product.description || null,
      "3DUrl": product["3DUrl"] || null,
      price: parseFloat(product.price) || 0,
      hasSize: false, // Cans typically don't have size variations
      isFeatured: index < 2, // Make first 2 products featured
      active: product.inStock !== false,
      productTypeId: canProductTypeId,
      createdAt: now,
      updatedAt: now,
    }));

    // Insert products first
    await queryInterface.bulkInsert("products", productRows, {});

    // Get the inserted product IDs (assuming they start from the next available ID)
    const [results] = await queryInterface.sequelize.query(
      "SELECT id, name FROM products WHERE productTypeId = ? ORDER BY id DESC LIMIT ?",
      {
        replacements: [canProductTypeId, canProductsData.length],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    // Create a mapping of product names to IDs
    const productIdMap = {};
    results.reverse().forEach((result, index) => {
      productIdMap[canProductsData[index].productName] = result.id;
    });

    // Prepare product details data
    const productDetailsRows = canProductsData.map((product) => {
      const productId = productIdMap[product.productName];
      const nutrition = product.nutritionFacts || {};
      
      return {
        productId: productId,
        serving_size: product.size || "330ml",
        energy_kcal: parseFloat(nutrition.calories) || 0,
        protein: 0, // Beverages typically have no protein
        fat: 0, // Beverages typically have no fat
        carbohydrates: nutrition.sugar ? parseFloat(nutrition.sugar.replace('g', '')) : 0,
        sugars: nutrition.sugar ? parseFloat(nutrition.sugar.replace('g', '')) : 0,
        fiber: 0, // Beverages typically have no fiber
        ingredient: product.ingredients ? product.ingredients.join(", ") : null,
        createdAt: now,
        updatedAt: now,
      };
    });

    // Insert product details
    await queryInterface.bulkInsert("product_details", productDetailsRows, {});

    // Prepare product images data
    const productImageRows = canProductsData.map((product) => {
      const productId = productIdMap[product.productName];
      
      return {
        product_id: productId,
        pic_url: product.imageUrl,
        display_order: 1, // Primary image
      };
    });

    // Insert product images
    await queryInterface.bulkInsert("product_images", productImageRows, {});

    console.log(`Successfully seeded ${canProductsData.length} can products with details and images`);
  },

  async down(queryInterface, Sequelize) {
    // Get product IDs for can products to clean up related data
    const [canProducts] = await queryInterface.sequelize.query(
      "SELECT id FROM products WHERE productTypeId = 1",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const productIds = canProducts.map(p => p.id);

    if (productIds.length > 0) {
      // Delete related data first
      await queryInterface.bulkDelete("product_images", {
        product_id: productIds
      }, {});

      await queryInterface.bulkDelete("product_details", {
        productId: productIds
      }, {});

      // Delete products
      await queryInterface.bulkDelete("products", {
        productTypeId: 1
      }, {});
    }

    console.log("Successfully removed can products and related data");
  },
};