const { Schema, model } = require("mongoose");
const dayjs = require("dayjs");
const reactionSchema = require("./Reaction");

// schema to create the thought model
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
            get: () => dayjs().format("DD/MM/YYYY, HH:mm:ss"),
        },
        username: [
            {
                type: String,
                ref: "User",
                required: true,
            },
        ],
        // parent to the reactionSchema
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        // stopped an id being generated as it's input already by the post request
        id: false,
    }
);

// create a virtual that retrieves the reactions array.length
thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

// initialize User model
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
