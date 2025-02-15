import { Customer } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    }


    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = generateToken(customer);


    return res.status(200).send({
      message: "Login Successful",
      customer,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
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
      const hashedpassword = await bcrypt.hash(password, 10);
      customer = new Customer({
        phone: phone,
        name: phone,
        password: hashedpassword,
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

export const fetchUser = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else {
      return res.status(403).send({ message: "No user found!" });
    }

    if (!user) {
      return res.status(403).send({ message: "No user found!" });
    }

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};
