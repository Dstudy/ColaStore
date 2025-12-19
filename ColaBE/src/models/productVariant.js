import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "ProductVariant",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "product_variants",
      timestamps: false,
    }
  );


