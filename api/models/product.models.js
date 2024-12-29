import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    images: {
        type: [String], // Array of strings to store image URLs or paths
        validate: {
            validator: (array) => array.length <= 10, // Validate a maximum of 10 images
            message: "You can upload a maximum of 10 images.",
        },
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    quantity: {
        type: String,
        required: true,
    },
    dimension: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    description: {
        type: String,
        
    },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
