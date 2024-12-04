import { Product } from "../models/index.js";

export const getProductByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const  products = await Product.find({category: categoryId})
    .select("-category")
    .exec();
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
