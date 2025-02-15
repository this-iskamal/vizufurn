import { Customer } from "../models/index.js";

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;


    let user =
      (await Customer.findById(userId)) 
    

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    let userModel;
    if (user.role === "Customer") {
      userModel = Customer;
    } else {
      return res.status(404).send({ message: "Invalid role not found" });
    }

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      return res.status(404).send({ message: "User not found" });
    }

    return res
      .status(200)
      .send({ message: "User updated successfully", user: updateUser });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};
