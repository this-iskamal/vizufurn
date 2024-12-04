import AdminJs from "adminjs";
import AdminJsFastify from "@adminjs/fastify";
import * as AdminJsMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { authenticate,sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";

AdminJs.registerAdapter(AdminJsMongoose);

export const admin = new AdminJs({
    resources: [
      {
        resource: Models.Customer,
        options: {
          listProperties: ["phone", "role", "isActivated"],
          filterProperties: ["phone", "role", "isActivated"],
        },
      },
      
      {
        resource: Models.Admin,
        options: {
          listProperties: ["email", "role", "isActivated"],
          filterProperties: ["email", "role"],
        },
      },
      {
        resource: Models.Product,
      },{
        resource: Models.Category,
      },
      {
        resource: Models.Order,
      },
      {
        resource: Models.Counter,
      },
    ],
    branding: {
      companyName: "VizuFurn",
      withMadeWithLove: false,
      favicon:
        "https://res.cloudinary.com/dpxlnadv0/image/upload/v1725549570/samples/logo.png",
    },
    defaultTheme:light.id,
    availableThemes: [dark, light, noSidebar],
    rootPath: "/admin",
  });

  export const buildAdminRouter = async (app) => {
    await AdminJsFastify.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookiePassword: process.env.COOKIE_PASSWORD,
        cookieName: "adminjs",
      },
      app,
      {
        store: sessionStore,
        saveUninitialized: true,
        secret: process.env.COOKIE_PASSWORD,
        cookie: {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
        },
      }
    );
  };