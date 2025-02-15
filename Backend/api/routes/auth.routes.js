import fastify from "fastify";
import {
  loginCustomer,
  refreshToken,
  registerCustomer,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export const authRoutes = async (fastify, options) => {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/customer/register", registerCustomer);
  fastify.get("/customer/validatetoken", verifyToken);
  fastify.post("/refresh-token", refreshToken);
};
