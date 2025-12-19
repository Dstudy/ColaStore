import { DataTypes } from "sequelize";
export default (sequelize) =>
  sequelize.define(
    "CartItem",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      cart_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    { tableName: "cart_items", timestamps: false }
  );
