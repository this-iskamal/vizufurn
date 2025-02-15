import { getmodels } from "../controllers/model.controller.js";




export const modelRoutes = async (fastify, options) => {

  
  fastify.get("/getmodels", getmodels);
 
};
