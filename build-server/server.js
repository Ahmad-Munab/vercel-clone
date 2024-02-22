const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use("/", require("./routes/routes.js"));

function check() {
    if (process.env.GITHUB_USERNAME && process.env.GITHUB_TOKEN) {
        return { safe_to_run: true };
    }
    return { err: "Environment variables not provided" };
}

if (check().safe_to_run) {
    app.listen(port, () => {
        console.log(`Server is running on http://0.0.0.0:${port}`);
    });
} else {
    throw new Error(safe_to_run().err);
}
