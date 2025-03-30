const User = require('../models/jsUser');

const userController = {
  // Get user details
  getUser: async (req, res) => {
    try {
      const userId = req.body.data.userId;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },
  
  createUser: async (req, res) => {
    try {
      const userData = req.body.data;
      console.log('User Data:', userData);
      const user = new User(userData);
      await user.save();
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = userController; 