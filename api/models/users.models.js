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

export const Customer = mongoose.model("Customer", customerSchema);

export const Admin = mongoose.model("Admin", adminSchema);
