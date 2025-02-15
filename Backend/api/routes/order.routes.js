import fastify from "fastify";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  confirmOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

export const orderRoutes = async (fastify, options) => {
  // fastify.addHook("preHandler", async (req, res) => {
  //   const isAuthenticated = await verifyToken(req, res);
  //   if (!isAuthenticated) {
  //     res.status(401).send({ message: "Unauthorized" });
  //   }
  // });

  fastify.post("/order", { preHandler: [verifyToken] }, createOrder);
  fastify.get("/order", getOrders);
  fastify.patch("/order/:orderId/status", updateOrderStatus);
  fastify.post("/order/:orderId/confirm", confirmOrder);
  fastify.get("/order/:orderId", getOrderById);
};
