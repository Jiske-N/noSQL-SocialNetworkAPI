const { User, Application } = require("../models");

// **`/api/users`**

// * `PUT` to update a user by its `_id`

// ---

// **`/api/users/:userId/friends/:friendId`**

// * `POST` to add a new friend to a user's friend list

// * `DELETE` to remove a friend from a user's friend list

// ---

module.exports = {
    // * `GET` all users
    // Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // * `GET` a single user by its `_id` and populated thought and friend data
    // Get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId }).select(
                "-__v"
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
    // * `POST` a new user:

    // ```json
    // // example data
    // {
    //   "username": "lernantino",
    //   "email": "lernantino@gmail.com"
    // }
    // ```
    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // * `DELETE` to remove user by its `_id`

    // **BONUS**: Remove a user's associated thoughts when deleted.
    // Delete a user and associated apps
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

            await Application.deleteMany({ _id: { $in: user.applications } });
            res.json({ message: "User and associated apps deleted!" });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
