import cartService from "../services/cartService.js";

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await cartService.getCart(userId);
    return res.status(200).json({ errCode: 0, message: "OK", data });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error getting cart",
      error: error.message,
    });
  }
};

const addItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId) {
      return res
        .status(400)
        .json({ errCode: 1, message: "productId is required" });
    }
    const item = await cartService.addItem(
      userId,
      productId,
      quantity ?? 1
    );
    return res.status(200).json({ errCode: 0, message: "OK", data: item });
  } catch (error) {
    return res
      .status(500)
      .json({ errCode: 1, message: "Error adding item", error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({
        errCode: 1,
        message: "productId and numeric quantity are required",
      });
    }
    const item = await cartService.updateItem(
      userId,
      productId,
      quantity
    );
    if (!item)
      return res
        .status(404)
        .json({ errCode: 1, message: "Cart item not found" });
    return res.status(200).json({ errCode: 0, message: "OK", data: item });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error updating item",
      error: error.message,
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const ok = await cartService.removeItem(
      userId,
      parseInt(productId, 10)
    );
    return res
      .status(200)
      .json({ errCode: 0, message: ok ? "Removed" : "Not Found" });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error removing item",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await cartService.clearCart(userId);
    return res.status(200).json({ errCode: 0, message: "Cleared" });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

export default { getCart, addItem, updateItem, removeItem, clearCart };
