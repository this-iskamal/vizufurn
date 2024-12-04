import {authRoutes} from './auth.routes.js'
import {categoryRoutes} from './category.routes.js'
import { orderRoutes } from './order.routes.js'
import { productRoutes } from './product.routes.js'
import { userRoutes } from './user.routes.js'

const prefix ="/api"

export const registerRoutes = async(fastify)=>{
    fastify.register(userRoutes,{prefix:prefix})
    fastify.register(authRoutes,{prefix:prefix})
    fastify.register(productRoutes,{prefix:prefix})
    fastify.register(categoryRoutes,{prefix:prefix})
    fastify.register(orderRoutes,{prefix:prefix})
}