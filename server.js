const express = require("express");
const bodyParser = require("body-parser");

const generalRoutes = require("./general.js").public_users;
const userRoutes = require("./auth_users.js").authenticated;

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use("/", generalRoutes);
app.use("/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
