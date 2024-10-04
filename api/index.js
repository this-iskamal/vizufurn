import fastify from 'fastify'
import dotenv from "dotenv";
import { connectDB } from './config/connection.js';


dotenv.config();

const start = async () => {
    await connectDB(process.env.MONGO_URI);

    const app = fastify();


    app.listen({ port:process.env.PORT}, (err, addr) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Server KU WoriPari listening on http://192.168.0.109:${process.env.PORT}`);
        }
      });
}    



start();



