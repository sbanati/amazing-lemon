const { User, Thought } = require("../models");

const UserController = {
  
  // Get all the user data
  async getAllUsers(req, res) {
    try {
      const userData = await User.find().select("-__v");
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Get one user by Id
  async getUserById(req, res) {
    try {
      // Extract user_id from the request parameters
      const userId = req.params.userId;

      const user = await User.findOne({ _id: userId })
        .select("-__v")
        .populate({ path: "thoughts", select: "-__v" })
        .populate({ path: "friends", select: "-__v" });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Create a user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update user by ID
  async updateUserById(req, res) {
    try {
      // Extract user_id from the request parameters
      const userId = req.params.userId;
      console.log(userId)
      // Extract the updated user data from the request parameters
      const userDataUpdate = req.body;
      console.log(userDataUpdate)

      // Use findOneAndUpdate to find the user by _id and update it with the provided data
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        userDataUpdate,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Delete user by id and BONUS associated thoughts
  async deleteUserById(req, res) {
    try {
      // Extract user_id from the request parameters
      const userId = req.params.userId;

      // Use findOneAndDelete to find the user by _id and delete it
      const deletedUser = await User.findOneAndDelete({ _id: userId });

      if (!deletedUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      // Delete all thoughts associated with the user
      await Thought.deleteMany({ _id: {$in: deletedUser.thoughts } });

      res.json({
        message: "User and associated thoughts successfully deleted",
        deletedUser,
      });
    } catch (err) {
      console.log(err);  
      res.status(500).json(err);
    }
  },

  // Add friend to a users friend list
  async addFriend(req, res) {
    try {
      // Extract user_id and friend_id from the request parameters
      // In a POST req, userId would be in the URL while friendId in the body
    
      const { friendId, userId } = req.params;

      //Find the user by id and update the friends array with the new friend
      const userData = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } },
        { new: true }
      );

      // If falsey, return a 404 response with a message
      if (!userData) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      // Send the updated user data in the response
      res.json(userData);
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  },

  // Remove friend from a users friend list
  async removeFriend({ params }, res) {
    try {
      // get userId and friendId from URL by destructing params
      const { userId, friendId } = params;

      const dbUserData = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: friendId } },
        { runValidators: true, new: true }
      );

      // If dbUserData is falsey, return a 404 response with a message
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      // Check if friendId is removed from friend array 
      const removed = !dbUserData.friends.includes(friendId);

      // Respond with success message if truthy
      if (removed) {
        res.json({ message: "Friend removed successfully!", dbUserData });
      } else {
        res
          .status(404)
          .json({
            message: "Friend not found in the users friend list",
            dbUserData,
          });
      }
    } catch (err) {
        console.log(err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
  },
};

// Export UserController
module.exports = UserController;
