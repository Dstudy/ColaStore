"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("sizes", [
      { name: "S", createdAt: now, updatedAt: now },
      { name: "M", createdAt: now, updatedAt: now },
      { name: "L", createdAt: now, updatedAt: now },
      { name: "XL", createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sizes", null, {});
  },
};


