const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const f = require("util").format;
const users = require("./routes/api/users");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);
const url = f(process.env.url);

mongoose
  .connect(
    url,
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongo db connected"))
  .catch(err => console.log(err));
  
app.use("/api/users", users);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
