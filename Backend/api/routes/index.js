
import {authRoutes} from './auth.routes.js'
import {categoryRoutes} from './category.routes.js'
import { modelRoutes } from './model.routes.js'
import { notificationRoutes } from './notification.routes.js'
import { orderRoutes } from './order.routes.js'
import { paymentRoutes } from './payment.routes.js'
import { productRoutes } from './product.routes.js'
import { reviewRoutes } from './review.routes.js'
import { userRoutes } from './user.routes.js'

const prefix ="/api"

export const registerRoutes = async(fastify)=>{
    fastify.register(userRoutes,{prefix:prefix})
    fastify.register(authRoutes,{prefix:prefix})
    fastify.register(productRoutes,{prefix:prefix})
    fastify.register(categoryRoutes,{prefix:prefix})
    fastify.register(orderRoutes,{prefix:prefix})
    fastify.register(paymentRoutes,{prefix:prefix})
    fastify.register(modelRoutes,{prefix:prefix})
    fastify.register(reviewRoutes,{prefix:prefix})
    fastify.register(notificationRoutes,{prefix:prefix})
}