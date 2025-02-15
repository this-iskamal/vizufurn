import { Object3D } from "../models/index.js";

export const getmodels = async (req, res) => {
    try {
      const { productId } = req.query;
    
      let query = {};
      
      if (productId) {
        query.product = productId;
      }
  
      const models = await Object3D.find(query)
        .populate('product', 'name price') // Populate product details if needed
        .exec();
  
      const formattedModels = models.map((model) => ({
        _id: model._id,
        product: model.product, // Product details populated earlier
        objFile: model.objFile,
        mtlFile: model.mtlFile,
        materialFile: model.materialFile,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      }));
  
      return res.status(200).send(formattedModels);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
  