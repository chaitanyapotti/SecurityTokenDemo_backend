const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const validateAddInvestorInput = require("../../validations/addinvestor");
const sgMail = require("@sendgrid/mail");
const validateJwt = require("../../validations/jwt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const fs = require("fs");
const path = require("path");
const htmlPath = path.resolve(__dirname, "../../models/EmailTemplate.html");
let html = fs.readFileSync(htmlPath, "utf8");

router.post("/addinvestor", (req, res) => {
  const { errors, isValid } = validateAddInvestorInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { expired, id: brokerId } = validateJwt(req);
  if (expired) {
    return res.status(400).json({ message: "Token has expired" });
  }
  User.findById(brokerId)
    .then(broker => {
      if (!broker) {
        errors.id = "user not found";
        return res.status(400).json(errors);
      } else {
        const { firstName, lastName, email } = req.body;
        const { first_name, last_name } = broker;
        const payload = { firstName, lastName, email, brokerId };
        jwt.sign(payload, keys.secretOrKey, { expiresIn: "1d" }, (err, token) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Some Error Occured" });
          }
          html = html.replace(/{{ action_url }}/g, `https://securitytoken.two12.co/signup?token=${token}`);
          html = html.replace(/{{ user }}/g, `${firstName} ${lastName}`);
          html = html.replace(/{{ brokerDealer }}/g, `${first_name} ${last_name}`);
          sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
          const msg = {
            to: email,
            from: "no-reply@two12.co",
            subject: "Sign Up with Two12",
            html: html
          };
          sgMail
            .send(msg)
            .then(resp => {
              res.json({ message: "Success" });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json(err.message);
            });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err.message);
    });

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
