import { Customer } from "../models/index.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "1d" }
    );
  
    const refreshToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "1d" }
    );
  
    return { accessToken, refreshToken };
  };

export const loginCustomer = async (req, res) => {
  try {
    const { phone, password } = req.body;

    let customer = await Customer.findOne({ phone });

    if (!customer) {
      return res.status(400).send({ message: "Invalid phone number" });
    } else if (customer.password !== password) {
      return res.status(400).send({ message: "Invalid password" });
    } else {
      const { accessToken, refreshToken } = generateToken(customer);

      return res.status(200).send({
        message: "Login Successful",
        customer,
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};

export const registerCustomer = async (req, res) => {
  try {
    const { phone, password } = req.body;
    let customer = await Customer.findOne({ phone });
    if (customer) {
      return res.status(400).send({ message: "Phone number already exists" });
    } else {
      customer = new Customer({
        phone: phone,
        password: password,
        role: "Customer",
        isActivated: true,
      });

      await customer.save();

      const { accessToken, refreshToken } = generateToken(customer);
      return res.status(200).send({
        message: "register Successful",

        customer,
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};


export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res
        .status(403)
        .send({ message: "Access Denied! Refresh token required!" });
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
      let user;
      if (decoded.role === "Customer") {
        user = await Customer.findById(decoded.userId);
      } else {
        return res
          .status(403)
          .send({ message: "Invalid or expired refresh token!" });
      }
      if (!user) {
        return res
          .status(403)
          .send({ message: "Invalid or expired refresh token!" });
      }
      const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
      return res.status(200).send({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      return res
        .status(403)
        .send({ message: "Invalid or expired refresh token!" });
    }
  };
  
