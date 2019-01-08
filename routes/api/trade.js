var express = require("express");
var router = express.Router();

const contractInstance = require("../../utils/contractInstance");
const web3Read = require("../../utils/web3Read");

function validateInputs(req, res, special = true) {
  if (!("network" in req.query && "address" in req.query)) return res.status(400).send("Bad Request");
  if (!(req.query.network in global.supportedNetworks)) return res.status(400).send("Not a supported network");
  if (special) {
    if (!("useraddress" in req.query)) return res.status(400).send("Bad Request");
    const web3 = web3Read(req.query.network);
    const isCheckSummed = web3.utils.checkAddressChecksum(req.query.useraddress);
    if (!isCheckSummed) {
      return res.status(400).send("Not a valid address");
    }
  }
}

//localhost:2020/web3/trade/getbuyrate?network=rinkeby&tokenaddress=0x42692adF9155525815A2C3097424CBcf72bE14c5&etheramount=0.1
router.get("/getbuyrate", (req, res) => {
  if (!("tokenaddress" in req.query && "etheramount" in req.query)) return res.status(400).json("Bad Request");
  if (!(req.query.network in global.kyberNetworkProxyAddress)) return res.status(400).json("Unsupported network for trading");
  const web3 = web3Read(req.query.network);
  const etherAmount = web3.utils.toWei(req.query.etheramount);
  contractInstance("KyberNetworkProxy", global.kyberNetworkProxyAddress[req.query.network], req.query.network)
    .then(instance => instance.methods.getExpectedRate(global.ETH_ADDRESS, req.query.tokenaddress, etherAmount).call())
    .then(result => {
      res.status(200).send({
        message: "Success",
        info: "This has decimals same as token (usually: 18)",
        data: result,
        units: "divide by 10^(decimals) or use web3.utils.fromWei() (if 18) to get normal rate. Rate: tokens/wei"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

//localhost:2020/web3/trade/getsellrate?network=rinkeby&tokenaddress=0x42692adF9155525815A2C3097424CBcf72bE14c5&tokenamount=100
router.get("/getsellrate", (req, res) => {
  if (!("tokenaddress" in req.query && "tokenamount" in req.query)) return res.status(400).json("Bad Request");
  if (!(req.query.network in global.kyberNetworkProxyAddress)) return res.status(400).json("Unsupported network for trading");
  const web3 = web3Read(req.query.network);
  //Assuming we support tokens with 18 decimals
  const tokenAmount = web3.utils.toWei(req.query.tokenamount);
  contractInstance("KyberNetworkProxy", global.kyberNetworkProxyAddress[req.query.network], req.query.network)
    .then(instance => instance.methods.getExpectedRate(req.query.tokenaddress, global.ETH_ADDRESS, tokenAmount).call())
    .then(result => {
      res.status(200).send({
        message: "Success",
        info: "This has decimals same as token (usually: 18)",
        data: result,
        units: "divide by 10^(decimals) or use web3.utils.fromWei() (if 18) to get normal rate. Rate: tokens/wei"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
