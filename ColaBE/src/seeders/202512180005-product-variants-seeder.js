"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Step 1: Handle products with sizes (hasSize = true)
    const productsWithSizes = await queryInterface.sequelize.query(
      "SELECT id, name FROM products WHERE hasSize = true",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (productsWithSizes && productsWithSizes.length > 0) {
      // Get all sizes (S, M, L, XL)
      const sizeRows = await queryInterface.sequelize.query(
        "SELECT id, name FROM sizes ORDER BY name",
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (sizeRows && sizeRows.length > 0) {
        // Stock quantities per size (example values)
        const stockBySize = {
          S: 25,
          M: 50,
          L: 50,
          XL: 25,
        };

        for (const product of productsWithSizes) {
          const productId = product.id;

          // Create variants for each size
          const variantRows = sizeRows.map((size) => ({
            product_id: productId,
            size_id: size.id,
            stock: stockBySize[size.name] || 0,
            createdAt: now,
            updatedAt: now,
          }));

          // Insert variants (skip if already exists due to unique constraint)
          for (const variant of variantRows) {
            const existing = await queryInterface.sequelize.query(
              "SELECT id FROM product_variants WHERE product_id = :pid AND size_id = :sid LIMIT 1",
              {
                type: Sequelize.QueryTypes.SELECT,
                replacements: { pid: variant.product_id, sid: variant.size_id },
              }
            );

            if (!existing || !existing[0]) {
              await queryInterface.bulkInsert("product_variants", [variant], {});
            }
          }
        }
      }
    }

    // Step 2: Ensure all products without sizes (hasSize = false or null) have at least one variant with null size_id
    const productsWithoutVariants = await queryInterface.sequelize.query(
      `SELECT p.id, p.name, p.hasSize
       FROM products p
       LEFT JOIN product_variants pv ON p.id = pv.product_id
       WHERE pv.id IS NULL
       GROUP BY p.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (productsWithoutVariants && productsWithoutVariants.length > 0) {
      console.log(`Found ${productsWithoutVariants.length} product(s) without variants. Creating default variants...`);

      for (const product of productsWithoutVariants) {
        // Create a default variant with null size_id and stock 0
        await queryInterface.bulkInsert("product_variants", [
          {
            product_id: product.id,
            size_id: null,
            stock: 1,
            createdAt: now,
            updatedAt: now,
          },
        ]);

        // Update hasSize to false if not already set
        if (product.hasSize !== false) {
          await queryInterface.sequelize.query(
            `UPDATE products SET hasSize = false WHERE id = :productId`,
            {
              replacements: { productId: product.id },
              type: Sequelize.QueryTypes.UPDATE,
            }
          );
        }

        console.log(`Created default variant for product: ${product.name} (ID: ${product.id})`);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product_variants", null, {});
  },
};

