import { getProductByCategoryId } from "../controllers/product.controller.js";

export const productRoutes = async (fastify,options)=>{
    fastify.get("/products/:categoryId", getProductByCategoryId);
}