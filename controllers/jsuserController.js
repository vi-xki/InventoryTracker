const User = require('../models/jsuser');

const jsuserController = {
    createUser: async (req, res) => {

        console.log('User Data:', req.body);
        try {
            const userData = {
                name: req.body.name,
                price: req.body.price
            };

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
    },

    getUser: async (req, res) => {
        try {
            const users = await User.find();
            return res.json({
                success: true,
                data: users
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = jsuserController; 