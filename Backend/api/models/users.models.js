import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Customer", "Admin"],
    required: true,
  },
  isActivated: { type: Boolean, default: false },
});

const customerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Customer"], default: "Customer" },

  address: { type: String },
});

const adminSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin"], default: "Admin" },
});
const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Seller"],
    default: "Seller",
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Seller = mongoose.model("Seller", sellerSchema);

export const Customer = mongoose.model("Customer", customerSchema);

export const Admin = mongoose.model("Admin", adminSchema);
