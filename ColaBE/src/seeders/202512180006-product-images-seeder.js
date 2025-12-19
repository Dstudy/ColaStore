"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Product images for all 10 example products
    // Format: { productName, images: [imageUrl, ...] }
    const productImages = [
      // Drinks
      {
        productName: "Cola Classic 330ml",
        images: [
          "https://via.placeholder.com/400x400/DC143C/FFFFFF?text=Cola+Classic",
          "https://via.placeholder.com/400x400/DC143C/FFFFFF?text=Cola+Side",
        ],
      },
      {
        productName: "Orange Soda 500ml",
        images: [
          "https://via.placeholder.com/400x400/FF8C00/FFFFFF?text=Orange+Soda",
          "https://via.placeholder.com/400x400/FF8C00/FFFFFF?text=Orange+Side",
        ],
      },

      // Shirts (with sizes)
      {
        productName: "Basic Logo T-Shirt",
        images: [
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Basic+Tee+Front",
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Basic+Tee+Back",
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Basic+Tee+Detail",
        ],
      },
      {
        productName: "Premium Polo Shirt",
        images: [
          "https://via.placeholder.com/400x400/000080/FFFFFF?text=Polo+Front",
          "https://via.placeholder.com/400x400/000080/FFFFFF?text=Polo+Side",
          "https://via.placeholder.com/400x400/000080/FFFFFF?text=Polo+Detail",
        ],
      },
      {
        productName: "Oversized Graphic Tee",
        images: [
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Graphic+Tee+Front",
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Graphic+Tee+Back",
        ],
      },

      // Other goods
      {
        productName: "Reusable Water Bottle 750ml",
        images: [
          "https://via.placeholder.com/400x400/C0C0C0/000000?text=Water+Bottle",
          "https://via.placeholder.com/400x400/C0C0C0/000000?text=Bottle+Open",
        ],
      },
      {
        productName: "Canvas Tote Bag",
        images: [
          "https://via.placeholder.com/400x400/F5F5DC/000000?text=Tote+Bag",
          "https://via.placeholder.com/400x400/F5F5DC/000000?text=Tote+Inside",
        ],
      },
      {
        productName: "Baseball Cap",
        images: [
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Cap+Front",
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Cap+Side",
        ],
      },
      {
        productName: "Wireless Earbuds",
        images: [
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Earbuds",
          "https://via.placeholder.com/400x400/000000/FFFFFF?text=Earbuds+Case",
        ],
      },
      {
        productName: "Desk Mouse Pad",
        images: [
          "https://via.placeholder.com/600x300/000000/FFFFFF?text=Mouse+Pad",
        ],
      },
    ];

    for (const item of productImages) {
      // Find product id by name
      const prodRows = await queryInterface.sequelize.query(
        "SELECT id FROM products WHERE name = :name LIMIT 1",
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { name: item.productName },
        }
      );

      if (!prodRows || !prodRows[0]) {
        console.warn(`Product not found: ${item.productName}`);
        continue;
      }

      const productId = prodRows[0].id;

      // Insert images for this product
      const imageRows = item.images.map((imageUrl, index) => ({
        product_id: productId,
        pic_url: imageUrl,
        display_order: index + 1,
      }));

      // Check if images already exist to avoid duplicates
      for (const imageRow of imageRows) {
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

