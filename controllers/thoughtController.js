// **`/api/thoughts`**

// * `GET` to get all thoughts

// * `GET` to get a single thought by its `_id`

// * `POST` to create a new thought (don't forget to push the created thought's `_id` to the associated user's `thoughts` array field)

// ```json
// // example data
// {
//   "thoughtText": "Here's a cool thought...",
//   "username": "lernantino",
//   "userId": "5edff358a0fcb779aa7b118b"
// }
// ```

// * `PUT` to update a thought by its `_id`

// * `DELETE` to remove a thought by its `_id`

// ---

// **`/api/thoughts/:thoughtId/reactions`**

// * `POST` to create a reaction stored in a single thought's `reactions` array field

// * `DELETE` to pull and remove a reaction by the reaction's `reactionId` value

const { Thought, User } = require("../models");

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();

            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get a single thought by Id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({
                _id: req.params.thoughtId,
            }).populate(["reactions"]);

            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "No thought with that ID" });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: "Thought created, but found no user with that ID",
                });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
