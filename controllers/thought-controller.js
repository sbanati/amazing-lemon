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


      // Create a new thought and associate the thought with the user who created it
      async createdThought(req, res) {
        try {
          // Destructure userId and the new thought from req.body
          const {userId, ...newThought} = req.body;

          // Create thought by passing the new thought object
          const thought = await Thought.create(newThought);

          // Add the created thoughts id to associated users thought array
          const user = await User.findOneAndUpdate(
            {_id: userId},
            {$addToSet: {thoughts: thought._id}},
            {new: true}
          );

          // Check if the user exists
          if (!user) {
            return res.status(404).json({message: 'Thought created, but no user found with that ID'});
          }

          //Respond with success
          res.json({message: 'Thought created successfully', thought});
        } catch (err) {
          console.log(err);
          res.status(500).json({message:'Internal server error', error:err});
        }
      },








































}
