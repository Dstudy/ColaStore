import models from "../models/index.js";

const { ProductImage, Product } = models;

/**
 * Add an image for a product. If display_order is not provided, append to end.
 */
const addImage = async ({
  productVariationId,
  pic_url,
  display_order = null,
}) => {
  try {
    // productVariationId is now productId
    const productId = productVariationId;
    
    // Determine display_order if not provided
    if (display_order == null) {
      const last = await ProductImage.findOne({
        where: { product_id: productId },
        order: [["display_order", "DESC"]],
      });
      display_order =
        last && last.display_order != null ? last.display_order + 1 : 1;
    }

    const img = await ProductImage.create({
      product_id: productId,
      pic_url,
      display_order,
    });

    return img;
  } catch (err) {
    console.error("addImage error", err);
    throw err;
  }
};

const updateImage = async (id, { pic_url, display_order }) => {
  try {
    const img = await ProductImage.findByPk(id);
    if (!img) return null;
    if (pic_url != null) img.pic_url = pic_url;
    if (display_order != null) img.display_order = display_order;
    await img.save();

    return img;
  } catch (err) {
    console.error("updateImage error", err);
    throw err;
  }
};

const deleteImage = async (id) => {
  try {
    const img = await ProductImage.findByPk(id);
    if (!img) return false;
    await img.destroy();
    return true;
  } catch (err) {
    console.error("deleteImage error", err);
    throw err;
  }
};

export default { addImage, updateImage, deleteImage };
