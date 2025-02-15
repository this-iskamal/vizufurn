import AdminJs, { actions } from "adminjs";
import AdminJsFastify from "@adminjs/fastify";
import * as AdminJsMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { authenticate, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import mongoose from "mongoose";

AdminJs.registerAdapter(AdminJsMongoose);

export const admin = new AdminJs({
  resources: [
    {
      resource: Models.Seller,
      options: {
        listProperties: ["name", "phone", "email", "shopName", "isActivated"],
        filterProperties: ["name", "phone", "email", "shopName", "isActivated"],
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
        },
      },
    },
    {
      resource: Models.Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role", "isActivated"],
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
        },
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
        },
      },
    },
    {
      resource: Models.Product,
      options: {
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
            before: async (request, context) => {
              const { currentAdmin } = context;
              if (currentAdmin && currentAdmin.role === "Seller") {
                const sellerId = currentAdmin.id;

                return {
                  ...request,
                  query: {
                    ...request.query,
                    "filters.sellerId": sellerId.toString(),
                  },
                };
              }

              return request;
            },
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
        },
      },
    },
    {
      resource: Models.Category,
      options: {
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
        },
      },
    },
    {
      resource: Models.Review,
      options: {
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin"||"Seller",
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Customer",
          },

          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
        },
      },
    },
    {
      resource: Models.Info,
      options:{
        actions:{
          list:{
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin"||"Seller",
          },
          edit:{
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
          delete:{
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin"|"Seller",
          },
          new:{
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          }
        }
      }
    }
    ,
    {
      resource: Models.Order,
      options: {
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              (currentAdmin && currentAdmin.role === "Admin") || "Seller",
          },

          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
        },
      },
    },
    {
      resource: Models.Counter,
      options: {
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Admin",
          },
        },
      },
    },
    {
      resource: Models.Object3D,
      options: {
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
          new: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "Seller",
          },
        },
      },
    },
  ],
  branding: {
    companyName: "VizuFurn",
    withMadeWithLove: false,
    favicon:
      "https://res.cloudinary.com/dpxlnadv0/image/upload/v1725549570/samples/logo.png",
  },
  defaultTheme: light.id,
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
