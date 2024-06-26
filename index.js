const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const PORT = 6543;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once("open", () => {
    app.listen(PORT, () => {
        console.log(
            `API server for Social Network API running on port ${PORT}!`
        );
    });
});
