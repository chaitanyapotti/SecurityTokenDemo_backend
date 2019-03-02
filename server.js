const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const f = require("util").format;
const users = require("./routes/api/users");
const erc20token = require("./routes/api/erc20token");
const price = require("./routes/api/price");
const transaction = require("./routes/api/transaction");
const trade = require("./routes/api/trade");
const contractdata = require("./routes/api/contractdata");
const subscriberdata = require("./routes/api/subscribers");
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

const supportedNetworks = Object.freeze({ main: 1, kovan: 2, rinkeby: 3, private: 4 });
global.supportedNetworks = supportedNetworks;

const kyberNetworkProxyAddress = Object.freeze({ rinkeby: "0x6624d80FC06169FAbeaa8c534693cc6bcd7513cc" });
global.kyberNetworkProxyAddress = kyberNetworkProxyAddress;

const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
global.ETH_ADDRESS = ETH_ADDRESS;

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("mongo db connection - success"))
  .catch(err => console.log(err));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use("/api/users", users);
app.use("/web3/erc20token", erc20token);
app.use("/api/price", price);
app.use("/api/transaction", transaction);
app.use("/web3/trade", trade);
app.use("/api/contractdata", contractdata);
app.use("/api/subscriberdata", subscriberdata);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
