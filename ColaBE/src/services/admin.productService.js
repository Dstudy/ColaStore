import db from "../models/index.js";
import { sequelize } from "../models/index.js";

const getAllProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await db.Product.findAll({
        include: [
          {
            model: db.ProductImage,
            attributes: ["id", "pic_url", "display_order"],
            limit: 1,
            required: false,
          },
          {
            model: db.ProductVariant,
            required: false, // Products must have variants, but we use false to avoid filtering
            attributes: ["id", "product_id", "size_id", "stock"],
            include: [
              {
                model: db.Size,
                attributes: ["id", "name"],
                required: false, // Size can be null for products without sizes
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]], // Newest first
      });
      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
};

const getProductById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await db.Product.findByPk(id, {
        include: [
          {
            model: db.ProductImage,
            attributes: ["id", "pic_url", "display_order"],
            required: false,
          },
          {
            model: db.ProductVariant,
            required: false, // Use LEFT JOIN to include products even if variants don't exist
            attributes: ["id", "product_id", "size_id", "stock"],
            include: [
              {
                model: db.Size,
                attributes: ["id", "name"],
                required: false, // Size can be null - use LEFT JOIN to include variants with null size_id
              },
            ],
          },
        ],
      });
      
      // Ensure product has at least one variant (should always be true, but handle edge case)
      if (product && (!product.ProductVariants || product.ProductVariants.length === 0)) {
        console.warn(`Product ${id} has no variants - this should not happen`);
      }
      
      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

const createProduct = (productData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const t = await sequelize.transaction();
      try {
        const { variations, variants, imageUrl, ...productFields } = productData;

        const product = await db.Product.create({
          ...productFields,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          transaction: t,
        });

        // Handle single image URL (new approach)
        if (imageUrl) {
          await db.ProductImage.create(
            {
              product_id: product.id,
              pic_url: imageUrl,
              display_order: 1,
            },
            { transaction: t }
          );
        }

        // Handle images (legacy `variations` payload)
        if (Array.isArray(variations)) {
          for (const v of variations) {
            const { images } = v;
            if (Array.isArray(images)) {
              for (const img of images) {
                await db.ProductImage.create(
                  { ...img, product_id: product.id },
                  { transaction: t }
                );
              }
            }
          }
        }

        // Handle size variants: [{ size_id?, stock }]
        // All products must have at least one variant
        if (Array.isArray(variants) && variants.length > 0) {
          for (const v of variants) {
            // Validate stock is provided
            if (v.stock === undefined || v.stock === null) {
              throw new Error("Stock is required for all variants");
            }
            await db.ProductVariant.create(
              {
                product_id: product.id,
                size_id: v.size_id || null, // Allow null size_id
                stock: v.stock,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              { transaction: t }
            );
          }

          // Set hasSize based on whether any variant has a size_id
          const hasSize = variants.some((v) => v.size_id != null);
          product.hasSize = hasSize;
          await product.save({ transaction: t });
        } else {
          // If no variants provided, create a default variant with null size_id
          // Stock defaults to 0 (must be provided explicitly in variants if needed)
          await db.ProductVariant.create(
            {
              product_id: product.id,
              size_id: null,
              stock: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { transaction: t }
          );
          product.hasSize = false;
          await product.save({ transaction: t });
        }

        await t.commit();
        resolve(
          await db.Product.findByPk(product.id, {
            include: [
              {
                model: db.ProductImage,
              },
            ],
          })
        );
      } catch (e) {
        await t.rollback();
        throw e;
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProduct = (id, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const t = await sequelize.transaction();
      try {
        const { variations, variants, imageUrl, ...productFields } = updateData;
        const [updatedRowsCount] = await db.Product.update(productFields, {
          where: { id },
          transaction: t,
        });
        if (updatedRowsCount === 0) {
          await t.rollback();
          return resolve(null);
        }

        // Handle single image URL (new approach)
        if (imageUrl !== undefined) {
          // Remove existing images
          await db.ProductImage.destroy({
            where: { product_id: id },
            transaction: t,
          });

          // Add new image if URL is provided
          if (imageUrl) {
            await db.ProductImage.create(
              {
                product_id: id,
                pic_url: imageUrl,
                display_order: 1,
              },
              { transaction: t }
            );
          }
        }

        // Update images (legacy `variations` payload)
        if (Array.isArray(variations)) {
          await db.ProductImage.destroy({
            where: { product_id: id },
            transaction: t,
          });

          for (const v of variations) {
            const { images } = v;
            if (Array.isArray(images)) {
              for (const img of images) {
                await db.ProductImage.create(
                  { ...img, product_id: id },
                  { transaction: t }
                );
              }
            }
          }
        }

        // Update size variants
        if (Array.isArray(variants)) {
          // All products must have at least one variant
          if (variants.length === 0) {
            throw new Error("At least one variant is required for each product");
          }

          // Validate all variants have stock
          for (const v of variants) {
            if (v.stock === undefined || v.stock === null) {
              throw new Error("Stock is required for all variants");
            }
          }

          // Remove old variants
          await db.ProductVariant.destroy({
            where: { product_id: id },
            transaction: t,
          });

          // Recreate from payload
          for (const v of variants) {
            await db.ProductVariant.create(
              {
                product_id: id,
                size_id: v.size_id || null, // Allow null size_id
                stock: v.stock,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              { transaction: t }
            );
          }

          // Update hasSize flag based on whether any variant has a size_id
          const hasSize = variants.some((v) => v.size_id != null);
          await db.Product.update(
            { hasSize },
            { where: { id }, transaction: t }
          );
        }

        await t.commit();
        const updatedProduct = await db.Product.findByPk(id, {
          include: [
            {
              model: db.ProductImage,
              required: false,
            },
            {
              model: db.ProductVariant,
              required: false,
              attributes: ["id", "product_id", "size_id", "stock"],
              include: [
                {
                  model: db.Size,
                  attributes: ["id", "name"],
                  required: false, // Size can be null for products without sizes
                },
              ],
            },
          ],
        });
        resolve(updatedProduct);
      } catch (e) {
        await t.rollback();
        throw e;
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const t = await sequelize.transaction();
      try {
        await db.ProductImage.destroy({
          where: { product_id: id },
          transaction: t,
        });
        await db.ProductVariant.destroy({
          where: { product_id: id },
          transaction: t,
        });
        const deletedRowsCount = await db.Product.destroy({
          where: { id },
          transaction: t,
        });
        await t.commit();
        resolve(deletedRowsCount > 0);
      } catch (e) {
        await t.rollback();
        throw e;
      }
    } catch (error) {
      reject(error);
    }
  });
};


const toggleProductActive = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await db.Product.findByPk(id);
      if (!product) {
        return resolve(null);
      }

      const newActiveState = !product.active;
      await db.Product.update({ active: newActiveState }, { where: { id } });

      const updatedProduct = await db.Product.findByPk(id, {
        include: [
          {
            model: db.ProductImage,
            attributes: ["id", "pic_url", "display_order"],
            limit: 1,
          },
        ],
      });

      resolve(updatedProduct);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllProductTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productTypes = await db.ProductType.findAll({
        attributes: ["id", "name", "description"],
        order: [["name", "ASC"]],
      });
      resolve(productTypes);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getAllProducts,
  getAllProductTypes,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
};
