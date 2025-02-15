import { getCustomerNotifications } from "../controllers/notification.controller.js";

export const notificationRoutes = async (fastify, options) => {
 
  fastify.get("/notifications/customer", getCustomerNotifications);
};