import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import Product from "./product.js";
import ProductImage from "./productImage.js";
import User from "./user.js";
import Role from "./role.js";
import Cart from "./cart.js";
import CartItem from "./cartItem.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";
import Analytics from "./analytics.js";
import Size from "./size.js";
import ProductVariant from "./productVariant.js";

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
  Size: Size(sequelize),
  ProductVariant: ProductVariant(sequelize),
  User: User(sequelize),
  Role: Role(sequelize),
  Cart: Cart(sequelize),
  CartItem: CartItem(sequelize),
  Order: Order(sequelize),
  OrderItem: OrderItem(sequelize),
  Analytics: Analytics(sequelize),
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


// ✅ Export models + sequelize instance
export { sequelize };
export { Op };
export default models;
