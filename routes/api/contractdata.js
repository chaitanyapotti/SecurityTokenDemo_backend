var express = require("express");
var router = express.Router();

const getContractDetails = require("../../utils/getContractDetails");

function validateInputs(req, res) {
  if (!("name" in req.query)) return res.status(400).json("Bad Request");
}

//localhost:2020/api/contractdata?name=KyberNetworkProxy
router.get("/", (req, res) => {
  validateInputs(req, res);
  getContractDetails(req.query.name)
    .then(response => {
      res.status(200).json({
        message: req.query.name,
        data: response
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err.message);
    });
});

module.exports = router;
