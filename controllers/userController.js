const { User, Thought } = require("../models");

module.exports = {
    // Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get a single user by Id and include thoughts and friends
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({
                _id: req.params.userId,
            }).populate(["thoughts", "friends"]);

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "No user with that ID" });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Update a single user by Id
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                // make the updated user return rather than the original
                { new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "No user with that ID" });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a user and associated thoughts
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({
                _id: req.params.userId,
            });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "No user with that ID" });
            }

            // delete any thoughts associated with the user
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: "User and associated thoughts deleted!" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Add a new friend to users friend list
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                // make the updated user return rather than the original
                { new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "No user with that ID" });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a friend from users friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "No user with that ID" });
            }

            res.json({ message: "Friend deleted!" });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
