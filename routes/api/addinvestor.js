const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const validateAddInvestorInput = require("../../validations/addinvestor");

router.post("/addinvestor", (req, res) => {
  const { errors, isValid } = validateAddInvestorInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ username: req.body.username })
    .then(user => {
      const investor = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        contact: req.body.contact,
        status: "pending"
      };
      user.investors.push(investor);
      console.log("user in add investor", user);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({});
    });
});

module.exports = router;
