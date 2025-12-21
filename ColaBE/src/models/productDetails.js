import { DataTypes } from "sequelize";

export default (sequelize) => {
    const ProductDetails = sequelize.define(
        "ProductDetails",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            productId: { type: DataTypes.INTEGER, allowNull: false },
            serving_size: { type: DataTypes.STRING },
            energy_kcal: { type: DataTypes.DECIMAL(5, 2) },
            protein: { type: DataTypes.DECIMAL(5, 2) },
            fat: { type: DataTypes.DECIMAL(5, 2) },
            carbohydrates: { type: DataTypes.DECIMAL(5, 2) },
            sugars: { type: DataTypes.DECIMAL(5, 2) },
            fiber: { type: DataTypes.DECIMAL(5, 2) },

            ingredient: { type: DataTypes.TEXT },

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            tableName: "product_details",
            timestamps: false,
        }
    );

    ProductDetails.associate = (models) => {
        ProductDetails.belongsTo(models.Product, {
            foreignKey: "productId",
        });
    };

    return ProductDetails;
};
