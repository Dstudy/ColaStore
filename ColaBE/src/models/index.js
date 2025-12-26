import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import Product from "./product.js";
import ProductImage from "./productImage.js";
import ProductDetails from "./productDetails.js";
import User from "./user.js";
import Role from "./role.js";
import Cart from "./cart.js";
import CartItem from "./cartItem.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";
import Analytics from "./analytics.js";
import Size from "./size.js";
import ProductVariant from "./productVariant.js";
import ProductType from "./productType.js";
import Review from "./review.js";

// ✅ Initialize Sequelize
const sequelize = new Sequelize("colastore", "root", "1", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// ✅ Initialize models
// We store the initialized models in this 'models' object
const models = {
  Product: Product(sequelize),
  ProductImage: ProductImage(sequelize),
  ProductDetails: ProductDetails(sequelize),
  Size: Size(sequelize),
  ProductVariant: ProductVariant(sequelize),
  ProductType: ProductType(sequelize),
  User: User(sequelize),
  Role: Role(sequelize),
  Cart: Cart(sequelize),
  CartItem: CartItem(sequelize),
  Order: Order(sequelize),
  OrderItem: OrderItem(sequelize),
  Analytics: Analytics(sequelize),
  Review: Review(sequelize),
};

// =================================================================
// ✅ Define Associations using the initialized models from the 'models' object
// =================================================================


// --- Product Images ---
models.Product.hasMany(models.ProductImage, {
  foreignKey: "product_id",
});
models.ProductImage.belongsTo(models.Product, {
  foreignKey: "product_id",
});

// --- Product Variants & Sizes ---
models.Product.hasMany(models.ProductVariant, {
  foreignKey: "product_id",
});
models.ProductVariant.belongsTo(models.Product, {
  foreignKey: "product_id",
});

models.Size.hasMany(models.ProductVariant, {
  foreignKey: "size_id",
});
models.ProductVariant.belongsTo(models.Size, {
  foreignKey: "size_id",
  allowNull: true, // Explicitly allow null for size_id
});

// --- Product Details ---
models.Product.hasOne(models.ProductDetails, {
  foreignKey: "productId",
  as: "ProductDetails", // Use plural to match frontend expectations
});
models.ProductDetails.belongsTo(models.Product, {
  foreignKey: "productId",
});

// --- Product Types ---
models.ProductType.hasMany(models.Product, {
  foreignKey: "productTypeId",
});
models.Product.belongsTo(models.ProductType, {
  foreignKey: "productTypeId",
});

// --- Users & Roles ---
models.Role.hasMany(models.User, { foreignKey: "role_id" });
models.User.belongsTo(models.Role, { foreignKey: "role_id" });

// --- Carts & Items ---
models.User.hasOne(models.Cart, { foreignKey: "user_id" });
models.Cart.belongsTo(models.User, { foreignKey: "user_id" });

models.Cart.hasMany(models.CartItem, { foreignKey: "cart_id" });
models.CartItem.belongsTo(models.Cart, { foreignKey: "cart_id" });

models.Product.hasMany(models.CartItem, {
  foreignKey: "product_id",
});
models.CartItem.belongsTo(models.Product, {
  foreignKey: "product_id",
});

// --- Orders & Items ---
models.User.hasMany(models.Order, { foreignKey: "user_id" });
models.Order.belongsTo(models.User, { foreignKey: "user_id" });

models.Order.hasMany(models.OrderItem, { foreignKey: "order_id" });
models.OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });

models.Product.hasMany(models.OrderItem, {
  foreignKey: "product_id",
});
models.OrderItem.belongsTo(models.Product, {
  foreignKey: "product_id",
});

// --- Reviews ---
models.Product.hasMany(models.Review, {
  foreignKey: "product_id",
  as: "reviews"
});
models.Review.belongsTo(models.Product, {
  foreignKey: "product_id",
  as: "product"
});

models.User.hasMany(models.Review, {
  foreignKey: "user_id",
  as: "reviews"
});
models.Review.belongsTo(models.User, {
  foreignKey: "user_id",
  as: "user"
});


// ✅ Export models + sequelize instance
export { sequelize };
export { Op };
export default models;
