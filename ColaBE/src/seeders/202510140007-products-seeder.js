"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 10 example products (drinks, shirts with sizes, and other goods)
    const seedProducts = [
      // Drinks - Cans
      {
        name: "Cola Classic 330ml",
        subtitle: "Sparkling soft drink",
        description: "Refreshing cola beverage in a convenient 330ml can.",
        price: 1.5,
        hasSize: false,
        productTypeId: 1, // can
      },
      {
        name: "Orange Soda 500ml",
        subtitle: "Citrus flavored drink",
        description: "Sweet and tangy orange-flavored carbonated drink.",
        price: 1.8,
        hasSize: false,
        productTypeId: 2, // bottle
      },

      // Shirts (have sizes) - Clothes
      {
        name: "Basic Logo T-Shirt",
        subtitle: "Unisex cotton tee",
        description: "Comfortable everyday T-shirt with front logo print.",
        price: 12.99,
        hasSize: true,
        productTypeId: 3, // clothes
      },
      {
        name: "Premium Polo Shirt",
        subtitle: "Casual smart wear",
        description: "Soft pique fabric polo suitable for both work and leisure.",
        price: 24.99,
        hasSize: true,
        productTypeId: 3, // clothes
      },
      {
        name: "Oversized Graphic Tee",
        subtitle: "Streetwear style",
        description: "Relaxed-fit T-shirt with bold back graphic.",
        price: 19.99,
        hasSize: true,
        productTypeId: 3, // clothes
      },

      // Other goods
      {
        name: "Reusable Water Bottle 750ml",
        subtitle: "Stainless steel",
        description:
          "Insulated stainless steel bottle that keeps drinks cold for hours.",
        price: 9.99,
        hasSize: false,
        productTypeId: 4, // goods
      },
      {
        name: "Canvas Tote Bag",
        subtitle: "Everyday carry",
        description: "Durable canvas tote bag ideal for shopping or commuting.",
        price: 7.5,
        hasSize: false,
        productTypeId: 4, // goods
      },
      {
        name: "Baseball Cap",
        subtitle: "Adjustable strap",
        description: "Classic cap with adjustable strap and embroidered logo.",
        price: 14.99,
        hasSize: false,
        productTypeId: 4, // goods
      },
      {
        name: "Wireless Earbuds",
        subtitle: "Bluetooth in-ear",
        description:
          "Compact wireless earbuds with charging case and touch controls.",
        price: 39.99,
        hasSize: false,
        productTypeId: 5, // gift
      },
      {
        name: "Desk Mouse Pad",
        subtitle: "Extended size",
        description: "Non-slip extended mouse pad suitable for work or gaming.",
        price: 5.99,
        hasSize: false,
        productTypeId: 4, // goods
      },
    ];

    // Map to DB rows
    const rows = seedProducts.map((p) => ({
      name: p.name,
      subtitle: p.subtitle || null,
      description: p.description || null,
      price: p.price,
      hasSize: p.hasSize,
      isFeatured: false,
      active: true,
      productTypeId: p.productTypeId || null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("products", rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("product_variants", null, {});
    await queryInterface.bulkDelete("products", null, {});
  },
};
