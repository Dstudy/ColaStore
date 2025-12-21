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

    // === THAY ĐỔI: Xây dựng các tùy chọn truy vấn chung ===
    // Chúng ta sẽ sử dụng các tùy chọn này cho cả `count` và `findAll`
    const commonOptions = {
      where: { active: true },
      include: [
        {
          model: ProductImage,
          attributes: ["pic_url"], // Chỉ lấy URL của ảnh
          limit: 1, // Chỉ lấy 1 ảnh (ảnh bìa)
          order: [["display_order", "ASC"]], // Lấy ảnh có thứ tự hiển thị đầu tiên
          required: false, // Sử dụng LEFT JOIN (quan trọng)
        },
        {
          model: ProductType,
          attributes: ["id", "name", "description"],
          required: false, // LEFT JOIN
        },
      ],
      distinct: true, // Cần thiết cho `count` khi có include
    };

    if (search) {
      commonOptions.where.name = sequelize.where(
        sequelize.fn("LOWER", sequelize.col("Product.name")),
        { [Op.like]: `%${search.toLowerCase()}%` }
      );
    }

    // Filter by product type if provided
    if (productType) {
      commonOptions.include[1].where = { name: productType };
      commonOptions.include[1].required = true; // INNER JOIN when filtering
    }

    // 1. Đếm tổng số sản phẩm khớp với bộ lọc
    const count = await Product.count(commonOptions);

    // THAY ĐỔI: Xây dựng logic SẮP XẾP
    let order = [];
    if (sortBy === "price-asc") {
      // Sắp xếp theo 'price' của chính Product
      order.push(["price", "ASC"]);
    } else if (sortBy === "price-desc") {
      // Sắp xếp theo 'price' của chính Product
      order.push(["price", "DESC"]);
    } else {
      order.push(["isFeatured", "DESC"]);
      order.push(["createdAt", "DESC"]);
    }

    // 2. Tìm các sản phẩm cho trang hiện tại
    const rows = await Product.findAll({
      ...commonOptions, // Sử dụng lại các tùy chọn (where, include, distinct)
      limit: numericLimit, // Thêm giới hạn
      offset: offset, // Thêm offset
      order: order,
      subQuery: true,
    });

    // === KẾT THÚC THAY ĐỔI ===

    return {
      totalProducts: count, // Sử dụng count từ truy vấn .count()
      totalPages: Math.ceil(count / numericLimit),
      currentPage: numericPage,
      products: rows, // Sử dụng rows từ truy vấn .findAll()
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
