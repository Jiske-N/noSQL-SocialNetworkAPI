const { User, Thought } = require("../models");

// **`/api/users`**

// * `PUT` to update a user by its `_id`

// ---

// **`/api/users/:userId/friends/:friendId`**

// * `POST` to add a new friend to a user's friend list

// * `DELETE` to remove a friend from a user's friend list

// ---

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

    // Get a single user and include thoughts and friends
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

            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: "User and associated thoughts deleted!" });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
