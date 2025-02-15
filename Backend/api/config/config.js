import dotenv from "dotenv";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin, Seller } from "../models/index.js";
dotenv.config();



const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.log("Session Store Error", error);
});

export const authenticate = async (email, password) => {
  if (email && password) {
    const admin = await Admin.findOne({ email });
    if (admin && password === admin.password) {
      return { email: admin.email, role: admin.role };
    }

    const seller = await Seller.findOne({ email });
    if (seller && password === seller.password) {
      return { email: seller.email, role: seller.role ,id:seller._id};
    }
  }
  return null;
};

  
  export const PORT = process.env.PORT || 3000;