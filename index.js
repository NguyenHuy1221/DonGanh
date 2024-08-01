require("dotenv").config();
const express = require("express");
const app = express();
const apiRoute = require("./router");
require("./models/mongo-provider.js");
const session = require("express-session");

app.use(express.json());
app.use("/api", apiRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
