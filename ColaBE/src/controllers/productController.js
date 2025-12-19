import productService from "../services/productService.js";

const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error getting products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        errCode: 1,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "OK",
      product: product,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error getting product details",
      error: error.message,
    });
  }
};

const getAllProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const images = await productService.getAllProductImages(productId);
    return res.status(200).json({
      errCode: 0,
      message: `Images for product ID: ${productId}`,
      images: images,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error getting product images",
      error: error.message,
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await productService.getFeaturedProducts();
    console.log(
      "[CONTROLLER-TRY] Data received from service:",
      featuredProducts
    );
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: featuredProducts,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error getting featured products",
      error: error.message,
    });
  }
};

export default {
  getAllProducts,
  getProductById,
  getAllProductImages,
  getFeaturedProducts,
};
