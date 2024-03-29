// Import the required dependencies
const { Schema, model, Types } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: "string",
      unique: true,
      required: true,
      trimmed: true,
    },
    email: {
      type: "string",
      unique: true,
      required: true,
      validate: {
        validator: function (v) {
          return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
  },

  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property called 'friendcount' 
//that gets the length of the user's friends array field on query.
postSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', userSchema); 

module.exports = User;


