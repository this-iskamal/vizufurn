import {
    getAllProducts,
    getProductByCategoryId,
    
    getProductById,
    
    searchProducts,
  } from "../controllers/product.controller.js";
  
  export const productRoutes = async (fastify, options) => {
    fastify.get("/products/:categoryId", getProductByCategoryId); // Get products by category
    fastify.get("/product/:productId", getProductById); // Get products by category
    fastify.get("/products", getAllProducts); // Get all products
    fastify.get("/products/search", searchProducts); // Get products by search query
  };
  