const { Schema, Types  } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: 'string',
            required: true,
            maxlength: 280,
        },
        username: {
            type: 'string',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function() {
                return this.createdAt.toLocaleString();
            }
        },

    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
    
);

//This will not be a model, but rather will be used as the reaction field's subdocument schema in the Thought model.
module.exports = reactionSchema;