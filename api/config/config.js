import dotenv from "dotenv";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";
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
      const user = await Admin.findOne({ email });
      if (!user) {
        return null;
      }
  
  
      if (password === user.password) {
        return Promise.resolve({email:user.email,role:user.role});
      } else {
        return null;
      }
    }
    return null;
  };
  
  export const PORT = process.env.PORT || 3000;