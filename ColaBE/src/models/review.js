import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Review = sequelize.define(
        "Review",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            isVerifiedPurchase: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
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
            tableName: "reviews",
            timestamps: true,
            updatedAt: "updatedAt",
            createdAt: "createdAt",
        }
    );

    Review.associate = (models) => {
        Review.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product"
        });
        Review.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user"
        });
    };

    return Review;
};
