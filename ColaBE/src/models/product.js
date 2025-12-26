import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      "3DUrl": { type: DataTypes.STRING },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      hasSize: { type: DataTypes.BOOLEAN, defaultValue: false },
      isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      productTypeId: { type: DataTypes.INTEGER },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "products",
      timestamps: true,
      updatedAt: "updatedAt",
      createdAt: "createdAt",
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.ProductType, {
      foreignKey: "productTypeId",
    });
  };

  return Product;
};
