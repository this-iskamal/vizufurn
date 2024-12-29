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
        id: item._id,
        item: item._id,
        count: item.quantity,
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
    const { status, customerId } = req.query;
   
    let query = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }

    const orders = await Order.find(query)
      .populate({
        path: 'items.item',
        select: 'name price', // Include name and price from Product model
      })
      .populate('customer', 'name email') // Include customer details if needed
      .exec();

    // Transform the response to include item prices directly in the items array
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      items: order.items.map((item) => ({
        _id: item.id,
        name: item.item.name,
        price: item.item.price,
        quantity: item.count,
      })),
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return res.status(200).send(formattedOrders);
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
