import fastify from 'fastify';
import dotenv from "dotenv";
import { connectDB } from './config/connection.js';
import { admin, buildAdminRouter } from "./config/setup.js";
import { registerRoutes } from "./routes/index.js";
import os from 'os'; 

dotenv.config();

const getLocalIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const net of interfaces[interfaceName]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address; 
            }
        }
    }
    return '127.0.0.1'; 
};

const start = async () => {
    await connectDB(process.env.MONGO_URI);

    const app = fastify();

    await registerRoutes(app);
    await buildAdminRouter(app);

    const localIP = getLocalIPAddress(); 


    app.listen({ port: process.env.PORT, host: localIP }, (err, addr) => {
      if (err) {
          console.error(err);
      } else {
          console.log(`Server KU WoriPari listening on http://${localIP}:${process.env.PORT}${admin.options.rootPath}`);
      }
  });
};

start();
