const { Schema, model } = require("mongoose");

// schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: `Not a valid email`,
            },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought",
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        toJSON: {
            // I'm not sure if we're supposed to have these as true or false
            virtuals: true,
            // getters: true,
        },
        // stopped an id being generated as it's input already by the post request
        id: false,
    }
);

// create a virtual that retrieves the friends array.length
userSchema.virtual("friendCount").get(function () {
    // I don't know at this stage what they want this retrieved as ie string, number etc.
    return this.friends.length;
});

// initialize User model
const User = model("User", userSchema);

module.exports = User;
