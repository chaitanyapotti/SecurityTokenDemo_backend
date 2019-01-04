const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const f = require("util").format;
const users = require("./routes/api/users");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);
const username = encodeURIComponent(process.env.Mongo_UserName);
const password = encodeURIComponent(process.env.Mongo_Password);

const url = f(`mongodb://%s:%s@${process.env.Mongo_URL_PORT}/two12`, username, password);

mongoose
  .connect(
    url,
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongo db connection - success"))
  .catch(err => console.log(err));

app.use("/api/users", users);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
