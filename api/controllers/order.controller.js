import { Customer, Order, Seller,Product } from "../models/index.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, totalPrice } = req.body;

    // Validate customer existence
    const customerData = await Customer.findById(userId);
    if (!customerData) {
      return res.status(404).send({ message: "Customer not found" });
    }

    // Validate and populate seller for each item
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id).populate("sellerId");
        if (!product) {
          throw new Error(`Product with ID ${item._id} not found`);
        }

        // Check if enough stock is available
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for product ID ${item._id}`);
        }

        return {
          ...item,
          seller: product.sellerId,
        };
      })
    );

    // Group items by sellers
    const sellersMap = populatedItems.reduce((acc, item) => {
      const sellerId = item.seller;
      if (!acc[sellerId]) {
        acc[sellerId] = {
          sellerId,
          items: [],
          totalPrice: 0,
        };
      }
      acc[sellerId].items.push({
        id: item._id,
        item: item._id,
        count: item.quantity,
      });
      acc[sellerId].totalPrice += item.price * item.quantity;
      return acc;
    }, {});

    // Convert sellers map to array
    const sellers = Object.values(sellersMap);

    // Create new order
    const newOrder = new Order({
      customer: userId,
      sellers,
      totalPrice,
    });

    // Save the order
    const savedOrder = await newOrder.save();

    // Update stock for each product
    await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id);
        if (product) {
          product.quantity -= item.quantity;
          await product.save();
        }
      })
    );

    return res.status(201).send(savedOrder);
  } catch (error) {
    console.error(error);
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
        path: 'sellers.sellerId',
        select: 'name email', // Include seller details
      })
      .populate('customer', 'name email') // Include customer details
      .populate('sellers.items.item', 'name price') // Include product details in items
      .exec();

    // Transform the response to include item prices and seller details
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      sellers: order.sellers.map((seller) => ({
        sellerId: seller.sellerId._id,
        sellerName: seller.sellerId.name,
        sellerEmail: seller.sellerId.email,
        items: seller.items.map((item) => ({
          productId: item.id,
          name: item.item.name,
          price: item.item.price,
          quantity: item.count,
        })),
        totalPrice: seller.totalPrice,
      })),
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
