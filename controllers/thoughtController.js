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

    // Update a single thought by Id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                // make the updated thought return rather than the original
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: "No thought with that ID",
                });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a single thought by Id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({
                _id: req.params.thoughtId,
            });

            if (!thought) {
                return res.status(404).json({
                    message: "No thought with that ID",
                });
            }

            const user = await User.findOneAndUpdate(
                { username: thought.username },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message:
                        "Thought deleted but no user with that thought found",
                });
            }

            res.json({
                message: "Thought deleted and removed from users thoughts!",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create a new reaction
    async addReaction(req, res) {
        try {
            // const reaction = await Reaction.create(req.body);
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message:
                        "Reaction created, but found no thought found with that ID",
                });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
