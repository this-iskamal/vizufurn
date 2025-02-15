import { Product } from "../models/index.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().exec();
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from request parameters
    const product = await Product.findById(productId) // Find product by ID

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    return res.status(200).send(product); // Return the found product
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


export const getProductByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  

  try {
    const products = await Product.find({ category: categoryId })
      .select("-category")
      .exec();
    
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


export const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).send({ message: "Search query is required." });
  }

  try {
    const regex = new RegExp(query, "i"); // Case-insensitive search
    const products = await Product.find({
      $or: [
        { name: regex },         // Matches product names
        // { description: regex },  // Matches product descriptions
      ],
    }).exec();

    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
