import {
    addReview,
    getReviewsByProductId,
    updateReview,
    deleteReview,
  } from "../controllers/review.controller.js";
  
  export const reviewRoutes = async (fastify, options) => {

    fastify.post("/reviews", addReview);
  
    fastify.get("/reviews/:productId", getReviewsByProductId);
 
    fastify.put("/reviews/:reviewId", updateReview);
  
    fastify.delete("/reviews/:reviewId", deleteReview);
  };