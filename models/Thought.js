const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const dayjs = require("dayjs");

// schema to create the reation subdocument within the thoughtSchema below
const reactionSchema = new Schema(
    {
        reactionId: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
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
            get: () => dayjs().format("DD/MM/YYYY, HH:mm:ss"),
        },
    },
    {
        toJSON: {
            getters: true,
        },
        // stopped an id being generated as it's already defined above
        id: false,
    }
);

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
            get: () => dayjs().format("DD/MM/YYYY, HH:mm:ss"),
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
