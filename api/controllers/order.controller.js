import { Customer, Order } from "../models/index.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, totalPrice } = req.body;

    const customerData = await Customer.findById(userId);
   

    if (!customerData) {
      return res.status(404).send({ message: "Customer not found" });
    }

    const newOrder = new Order({
      customer: userId,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
     
      totalPrice,
      
      
    });
    const savedOrder = await newOrder.save();
    return res.status(201).send(savedOrder);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
   

    

    

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    if (order.status !== "available") {
      return res.status(400).send({ message: "Order not available" });
    }
    order.status = "confirmed";
   
    

   

    await order.save();
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { status } = req.body;

   

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    if (["cancelled", "delivered"].includes(order.status)) {
      return res.status(400).send({ message: "Order cannot be updated" });
    }

    

    order.status = status;
  

    await order.save();

    

    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, customerId,  } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }
   

    const orders = await Order.find(query).populate(
      "customer items.item"
    );
   

    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "customer  items.item"
    );
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
