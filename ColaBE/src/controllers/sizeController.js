import db from "../models/index.js";

const getAllSizes = async (req, res) => {
    try {
        const sizes = await db.Size.findAll({
            attributes: ["id", "name"],
            order: [["id", "ASC"]],
        });

        return res.status(200).json({
            errCode: 0,
            message: "OK",
            sizes: sizes,
        });
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            message: "Error getting sizes",
            error: error.message,
        });
    }
};

export default {
    getAllSizes,
};
