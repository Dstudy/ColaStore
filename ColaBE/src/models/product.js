import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      hasSize: { type: DataTypes.BOOLEAN, defaultValue: false },
      isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "products",
      timestamps: false,
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.Review, {
      foreignKey: "product_id",
    });
  };

  return Product;
};
