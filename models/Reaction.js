const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const dayjs = require("dayjs");

// schema to create the reaction subdocument within the thoughtSchema
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

module.exports = reactionSchema;
