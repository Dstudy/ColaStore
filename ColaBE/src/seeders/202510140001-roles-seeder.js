"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if roles already exist by name to avoid duplicate key errors
    const existingRoles = await queryInterface.sequelize.query(
      "SELECT name FROM roles WHERE name IN ('admin', 'user')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingRoles && existingRoles.length > 0) {
      console.log("Roles already exist, skipping seed");
      return;
    }

    // Insert roles - try with explicit IDs first, fallback to auto-increment if needed
    try {
      await queryInterface.bulkInsert(
        "roles",
        [
          { id: 1, name: "admin" },
          { id: 2, name: "user" },
        ],
        {}
      );
    } catch (error) {
      // If explicit IDs cause issues, insert without IDs
      if (error.name === "SequelizeUniqueConstraintError" || 
          error.name === "SequelizeValidationError" ||
          error.message.includes("Duplicate entry") ||
          error.message.includes("PRIMARY")) {
        console.log("Inserting roles without explicit IDs...");
        await queryInterface.bulkInsert(
          "roles",
          [
            { name: "admin" },
            { name: "user" },
          ],
          {}
        );
      } else {
        throw error;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", { name: ["admin", "user"] }, {});
  },
};
