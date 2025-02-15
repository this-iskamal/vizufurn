import { Info } from "../models/index.js";



export const getCustomerNotifications = async (req, res) => {
  try {
    const notifications = await Info.find({ 
      
    }).populate('productId');
    return res.status(200).send(notifications);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
