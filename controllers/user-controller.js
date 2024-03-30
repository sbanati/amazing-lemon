const { User } = require('../models');

const UserController = {
    
    // Get all the user data 
    async getAllUsers(req, res) {
        try {
            const userData = await User.find()
            .select('-__v')
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get one user by Id
    async getUserById(req, res) {
        try {
            // Extract user_id from the request parameters
            const userId = req.params.userId;
            
            const user = await User.findOne({_id: userId})
            .select('-__v')
            .populate({path: 'thoughts', select: '-__v'})
            .populate({path: 'friends', select: '-__v'});

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID'});
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create a user
    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    


    // Update user by ID
    async updateUserById(req, res) {
        try {
            // Extract user_id from the request parameters
            const userId = req.params.id;
            // Extract the updated user data from the request parameters
            const userDataUpdate = req.body;
            
            // Use findOneAndUpdate to find the user by _id and update it with the provided data
            const updatedUser = await User.findOneAndUpdate({_id: userId}, userDataUpdate, {new: true})
            
            if(!updatedUser) {
                return res.status(404).json({ message: 'No user with that ID'});
            }
            res.json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },


    // Delete user by id and BONUS associated thoughts
    async deleteUserById(req, res,) {
        try {
            // Extract user_id from the request parameters
            const userId = req.params.userId;

            // Use findOneAndDelete to find the user by _id and delete it
            const deletedUser = await User.findOneAndDelete({_id: userId});

            if(!deletedUser) {
                return res.status(404).json({ message: 'No user with that ID'});
            }

            // Delete all thoughts associated with the user
            await Thought.deleteMany({ username: deletedUser.username});

            res.json({ message:'User and associated thoughts successfully deleted', deletedUser});
        } catch (err) {
            res.status(500).json(err);
        }
    }






















};


// Export UserController
module.exports = UserController;