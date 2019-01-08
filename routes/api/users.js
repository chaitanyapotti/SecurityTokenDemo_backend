const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");

// @route POST api/users/register
// @desc register a user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = " Email already exists";
        return res.status(400).json(errors);
      }
      User.findOne({ username: req.body.username })
        .then(user => {
          if (user) {
            errors.username = "username already exists";
            return res.status(400).json(errors);
          } else {
            const newUser = new User({
              email: req.body.email,
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              username: req.body.username,
              password: req.body.password,
              role: req.body.role
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => res.status(200).json(user))
                  .catch(err => {
                    console.log(err);
                    return res.status(500).json({});
                  });
              });
            });
          }
        })
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

// @route POST/users/login
// @desc Login user
// @access Public

router.post("/login", (req, res) => {
  const usernameOrEmail = req.body.usernameOrEmail;
  const password = req.body.password;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: usernameOrEmail })
    .then(user => {
      if (!user) {
        User.findOne({ username: usernameOrEmail })
          .then(user => {
            if (!user) {
              errors.usernameOrEmail = "User or Email not found";
              return res.status(400).json(errors);
            }
            bcrypt.compare(password, user.password).then(isMatch => {
              if (isMatch) {
                const payload = { name: user.name, id: user.id };
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 360000 }, (err, token) => {
                  return res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                    role: user.role,
                    first_name: user.first_name,
                    email: user.email,
                    phone: user.phone,
                    last_name: user.last_name,
                    publicAddress: user.publicAddress,
                    investors: user.investors || undefined,
                    reserveAddress: user.reserveAddress || undefined,
                    date: user.date,
                    id: user._id,
                    status: user.status,
                    conversionRatesAddress: user.conversionRatesAddress || undefined
                  });
                });
              } else {
                errors.password = "password is incorrect";
                return res.status(400).json(errors);
              }
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({});
          });
      } else {
        bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              const payload = { name: user.name, id: user.id };

              //Sigin Token
              jwt.sign(payload, keys.secretOrKey, { expiresIn: 360000 }, (err, token) => {
                return res.status(200).json({
                  success: true,
                  token: "Bearer " + token,
                  role: user.role,
                  first_name: user.first_name,
                  publicAddress: user.publicAddress,
                  investors: user.investors || undefined,
                  reserveAddress: user.reserveAddress || undefined,
                  conversionRatesAddress: user.conversionRatesAddress || undefined
                });
              });
            } else {
              (errors.password = "password is incorrect"), res.status(400).json(errors);
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({});
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({});
    });
});

module.exports = router;
