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
          const {thoughtId} = req.params;
    
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


      // Update thought by ID
      async updateThought(req, res) {

        try {
          // Destructuring the thoughtId and the updated thought data from req.body
          const { thoughtId, ...updatedThoughtData} = req.body;

          // Update thought based on its id
          const updatedThought = await Thought.findOneAndUpdate(
            {_id: thoughtId},
            { $set: updatedThoughtData},
            {runValidators: true, new: true}
          );
          
          // if updatedThought is falsey
          if (!updatedThought) {
            return res.status(404).json({message: 'No thought with that ID'});
          }
          res.json({message: 'Thought updated successfully', updatedThought});
        } catch (err) {
          console.log(err);
          res.status(500).json({message: 'Internal server error', error: err});
        }
      },



      // Delete thought by ID
      async deleteThoughtById(req, res) {
        try {
          // Desctructure thoughtId from the request parameters
          const { thoughtId } = req.params

          //Delete the thought by its _id
          const deletedThought = await Thought.findOneAndDelete(
            {_id: thoughtId});

          // Check if falsey
          if (!deletedThought) {
            return res.status(404).json({message: 'No thought with that ID'});
          }
          res.json({message: 'Thought deleted successfully', deletedThought});

        } catch (error) {
          console.log(error);
          res.status(500).json({message: 'Internal server error', error: err});
        }
      },

      // Create a new reaction stored in a single thought's reactions array field
      async addReaction(req, res) {
        try {
          // Destructure thoughtId and the new reaction from URL and req.body
          const { thoughtId } = req.params;
          const { ...newReaction } = req.body;

          // Update the thought by adding the reaction 
          const updatedThought = await Thought.findOneAndUpdate(
            {_id: thoughtId},
            {$addToSet: {reactions: newReaction}},
            {runValidators: true, new: true}
          );

          // Check for thought falsey
          if (!updatedThought) {
            return res.status(404).json({message: 'No thought with that ID'});
          }
          res.json({message: 'Reaction added successfully', updatedThought});


        } catch (err) {
          console.log(err);
          res.status(500).json({message: 'Internal server error', error: err});
        }
      },



      // Delete a reaction by ID
      async removeReaction({ params }, res) {
        try {
          const updatedThought = await Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            {runValidators: true, new: true}
          );

          // If updatedThought is falsey
          if (!updatedThought) {
            return res.status(404).json({message: 'No thought with this id!'});
          }

          res.json({message: 'Reaction removed successfully', updatedThought});

        } catch (err) {
          console.log(err);
          res.status(500).json({message: 'Internal server error', error: err});
        }
      }


}
module.exports = ThoughtController;