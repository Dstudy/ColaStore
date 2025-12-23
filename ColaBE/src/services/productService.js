import models from "../models/index.js";
import { sequelize } from "../models/index.js";
import { Op } from "../models/index.js";

const {
  Product,
  ProductImage,
  ProductVariant,
  Size,
  ProductDetails,
  ProductType,
} = models;

const getAllProducts = async (queryParams) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      sortBy,
      productType,
    } = queryParams;

    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;

    // Build where clause for Product
    const whereClause = { active: true };

    // Add search filter
    if (search) {
      whereClause.name = sequelize.where(
        sequelize.fn("LOWER", sequelize.col("Product.name")),
        { [Op.like]: `%${search.toLowerCase()}%` }
      );
    }

    // Build include array
    const includeArray = [
      {
        model: ProductImage,
        attributes: ["pic_url"],
        limit: 1,
        order: [["display_order", "ASC"]],
        required: false,
      },
      {
        model: ProductType,
        attributes: ["id", "name", "description"],
        required: false,
      },
    ];

    // Filter by product type if provided
    if (productType) {
      includeArray[1].where = { name: productType };
      includeArray[1].required = true; // INNER JOIN when filtering
    }

    // Build common options
    const commonOptions = {
      where: whereClause,
      include: includeArray,
      distinct: true,
    };

    // 1. Count total products matching the filter
    const count = await Product.count(commonOptions);

    // Build sort order
    let order = [];
    if (sortBy === "price-asc") {
      order.push(["price", "ASC"]);
    } else if (sortBy === "price-desc") {
      order.push(["price", "DESC"]);
    } else {
      order.push(["isFeatured", "DESC"]);
      order.push(["createdAt", "DESC"]);
    }

    // 2. Find products for current page
    const rows = await Product.findAll({
      ...commonOptions,
      limit: numericLimit,
      offset: offset,
      order: order,
      subQuery: false, // Changed to false to fix filtering issue
    });

    return {
      totalProducts: count,
      totalPages: Math.ceil(count / numericLimit),
      currentPage: numericPage,
      products: rows,
    };
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw new Error("Failed to get products.");
  }
};

const getProductById = async (id) => {
  const product = await Product.findOne({
    where: { id, active: true },
    include: [
      {
        model: ProductImage,
        required: false,
      },
      {
        model: ProductVariant,
        required: false, // Use LEFT JOIN to include products even if variants don't exist (shouldn't happen, but safe)
        attributes: ["id", "product_id", "size_id", "stock"],
        include: [
          {
            model: Size,
            attributes: ["id", "name"],
            required: false, // Size can be null - use LEFT JOIN to include variants with null size_id
          },
        ],
      },
      {
        model: ProductDetails,
        as: "ProductDetails", // Must match the alias in the association
        required: false, // Use LEFT JOIN to include products even if details don't exist
      },
    ],
  });

  if (!product) {
    return null;
  }

  // Ensure product has at least one variant (should always be true, but handle edge case)
  // If no variants exist, this is a data integrity issue
  if (!product.ProductVariants || product.ProductVariants.length === 0) {
    console.warn(`Product ${id} has no variants - this should not happen`);
  }

  return product;
};


const getAllProductImages = async (productId) => {
  const images = await ProductImage.findAll({
    where: { product_id: productId },
    order: [["display_order", "ASC"]],
  });

  return images;
};

const getFeaturedProducts = async () => {
  try {
    const featuredProducts = await Product.findAll({
      where: { isFeatured: true, active: true }, // Only show active featured products
      limit: 8,
      include: [
        {
          model: ProductImage,
          limit: 1,
        },
      ],
    });

    return { products: featuredProducts };
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    throw new Error("Failed to get featured products.");
  }
};

const getAllProductVariants = async (queryParams) => {
  // ProductVariation removed - this function is no longer applicable
  return {
    totalVariants: 0,
    totalPages: 0,
    currentPage: 1,
    variants: [],
  };
};

export default {
  getAllProducts,
  getProductById,
  getAllProductImages,
  getFeaturedProducts,
  getAllProductVariants,
};
