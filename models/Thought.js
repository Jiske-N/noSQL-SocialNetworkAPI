const { Schema, model, SchemaType } = require("mongoose");
const dayjs = require("dayjs");

// schema to create the reation subdocument within the thoughtSchema below
const reactionSchema = new Schema({
    reactionId: {
        type: ObjectId,
        default: () => new ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// schema to create the thought model
// parent to the reactionSchema above
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: [
            {
                type: String,
                ref: "User",
                required: true,
            },
        ],
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            // I'm not sure if we're supposed to have these as true or false
            virtuals: true,
            getters: true,
        },
    }
);

// format the createdAt timestamp
thoughtSchema.virtual("formatCreatedAt").get(function () {
    return dayjs(this.createdAt).format("DD/MM/YYYY, HH:mm:ss");
});

// create a virtual that retrieves the reactions array.length
thoughtSchema.virtual("reactionCount").get(function () {
    // I don't know at this stage what they want this retrieved as ie string, number etc.
    return this.reactions.length;
});

// initialize User model
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;