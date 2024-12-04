import { getAllCategories } from "../controllers/category.controller.js";

export const categoryRoutes = async (fastify,options)=>{
    fastify.get("/categories", getAllCategories);
}