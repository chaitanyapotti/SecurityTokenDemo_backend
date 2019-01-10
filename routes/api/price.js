const express = require("express");
const router = express.Router();
const PriceHistory = require("../../models/PriceHistory");

function validateInputs(req, res, special = true) {
  if (!("tokenaddress" in req.query)) return res.status(400).json("Bad Request");
}

router.get("/", (req, res) => {
  validateInputs(req, res);
  PriceHistory.findOne({ token_address: req.query.tokenaddress })
    .then(priceHistory => {
      if (!priceHistory) {
        return res.status(404).json({ tokenAddress: "token not found" });
      } else {
        return res.status(200).json({
          currentprice: priceHistory.current_price,
          lastprice: priceHistory.last_price,
          tokenaddress: priceHistory.token_address,
          change: priceHistory.change,
          ticker: priceHistory.ticker
        });
      }
    })
    .catch(err => res.status(400).json(err.message));
});

module.exports = router;
