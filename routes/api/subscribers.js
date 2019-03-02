const express = require("express");
const router = express.Router();
const Subscribe = require("../../models/Subscribe");

const validateSubscriberInput = require("../../validations/subscribe");

router.post("/", (req, res) => {
  const { errors, isValid } = validateSubscriberInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Subscribe.findOne({ email: req.body.email })
    .then(subscribe => {
      if (subscribe) {
        errors.email = " Email already exists";
        return res.status(400).json(errors);
      }
      const subscriber = new Subscribe({
        email: req.body.email
      });
      subscriber
        .save()
        .then(user => res.status(200).json(user))
        .catch(err => {
          console.log(err);
          return res.status(500).json({});
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({});
    });
});

module.exports = router;
