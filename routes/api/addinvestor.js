const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const validateAddInvestorInput = require("../../validations/addinvestor");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");
const htmlPath = path.resolve(__dirname, "../../models/EmailTemplate.html");
const html = fs.readFileSync(htmlPath, "utf8");
console.log(html);

router.post("/addinvestor", (req, res) => {
  const { errors, isValid } = validateAddInvestorInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  html.replace("{{ action_url }}", `https://securitytoken.two12.co/signup?token=${token}`);
  const msg = {
    to: req.body.email,
    from: "chaitanya@two12.co",
    subject: "Sign Up with Two12",
    html: html
  };
  sgMail.send(msg, false, (err, resp) => {
    if (err) console.log(err, "error");
    else console.log(resp, "success");
  });

  return res.json({});
  // don't use existing code here but write node mailer
  // User.findOne({ username: req.body.username })
  //   .then(user => {
  //     const investor = {
  //       firstname: req.body.firstname,
  //       lastname: req.body.lastname,
  //       email: req.body.email,
  //       contact: req.body.contact,
  //       status: "pending"
  //     };
  //     user.investors.push(investor);
  //     return res.status(200).json(investor);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     return res.status(500).json({});
  //   });
});

module.exports = router;
