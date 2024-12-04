import { Category } from "../models/index.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
