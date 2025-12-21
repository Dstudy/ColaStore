import { DataTypes } from "sequelize";

export default (sequelize) => {
    const ProductType = sequelize.define(
        "ProductType",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false, unique: true },
            description: { type: DataTypes.TEXT },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            tableName: "productTypes",
            timestamps: false,
        }
    );

    ProductType.associate = (models) => {
        ProductType.hasMany(models.Product, {
            foreignKey: "productTypeId",
        });
    };

    return ProductType;
};
