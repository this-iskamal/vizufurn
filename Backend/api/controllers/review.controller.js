import { Review } from "../models/index.js";

export const addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    const review = new Review({
      productId,
      userId,
      rating,
      comment,
    });

    await review.save();
    return res.status(201).send(review);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


export const getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate("userId", "name");
    return res.status(200).send(reviews);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    return res.status(200).send(review);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    return res.status(200).send({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
