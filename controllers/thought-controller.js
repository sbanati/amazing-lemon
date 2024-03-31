const { Thought, User, Reaction } = require('../models');
const {Types} = require('mongoose');

// Define the ThoughtController object
// contains methods for handling  API requests related to thoughts 

const ThoughtController = {
    
    // Get all the user data
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select("-__v");
      res.json(thoughts);
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  },

    // Get one user by Id
    async getThoughtById(req, res) {
        try {
          // Extract user_id from the request parameters
          const thoughtId = req.params.thoughtId;
    
          const thought = await Thought.findOne({ _id: thoughtId })
            .select("-__v")
           
          if (!thought) {
            return res.status(404).json({ message: "No thought with that ID" });
          }
    
          res.json(thought);
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },











































}
