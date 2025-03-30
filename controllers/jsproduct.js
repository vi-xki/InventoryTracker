const Product = require('../models/jsproduct');

const productController = {

  getProduct: async (req, res) => {
    try {
      const productId = req.body.data.productId;
      console.log('Product ID:', productId);
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      return res.json({
        success: true,
        data: product
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },
  
  listProducts: async (req, res) => {
    try {
      const products = await Product.find();
      return res.json({
        success: true,
        data: products
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = productController; 