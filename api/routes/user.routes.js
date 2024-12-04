import fastify from "fastify";
import { fetchUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateUser } from "../controllers/user.controller.js";


export const userRoutes = async (fastify, options) => {
  fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
  fastify.patch("/user", { preHandler: [verifyToken] }, updateUser);
};
