import mongoose from "mongoose";

const Object3DSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true, 
  },
  objFile: {
    type: String, 
    required: true,
  },
  mtlFile: {
    type: String,
    required: true,
  },
  materialFile: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Object3D = mongoose.model('Object3D', Object3DSchema);

export default  Object3D;
