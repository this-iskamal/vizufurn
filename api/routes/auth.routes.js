import fastify from "fastify";
import {

  loginCustomer,

  refreshToken,
  registerCustomer,
} from "../controllers/auth.controller.js";


export const authRoutes = async (fastify, options) => {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/customer/register", registerCustomer);

  fastify.post("/refresh-token", refreshToken);
};
