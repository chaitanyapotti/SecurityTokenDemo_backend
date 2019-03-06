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
              role: req.body.role,
              date: new Date(),
              publicAddress: req.body.publicAddress,
              kycStatus: "PENDING",
              accreditationStatus: "PENDING",
              amlStatus: "PENDING",
              status: "PENDING"
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
                    id: user._id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    date: user.date,
                    phone: user.phone,
                    publicAddress: user.publicAddress,
                    role: user.role,
                    status: user.status,
                    kycStatus: user.kycStatus,
                    accreditationStatus: user.accreditationStatus,
                    amlStatus: user.amlStatus,
                    reserveType: user.reserveType || undefined,
                    reserveAddress: user.reserveAddress || undefined,
                    conversionRatesAddress: user.conversionRatesAddress || undefined,
                    investors: user.investors || undefined
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
                  id: user._id,
                  username: user.username,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  date: user.date,
                  phone: user.phone,
                  publicAddress: user.publicAddress,
                  role: user.role,
                  status: user.status,
                  kycStatus: user.kycStatus,
                  accreditationStatus: user.accreditationStatus,
                  amlStatus: user.amlStatus,
                  reserveType: user.reserveType || undefined,
                  reserveAddress: user.reserveAddress || undefined,
                  conversionRatesAddress: user.conversionRatesAddress || undefined,
                  investors: user.investors || undefined
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

// @route GET/users/status
// @desc get verification status of the user
// @access Public

router.get("/status", (req, res) => {
  const user_id = req.query.id;
  User.findById(user_id)
    .then(user => {
      if (!user) {
        return res.status(400).json({ id: "user not found" });
      } else {
        return res.status(200).json({
          id: user._id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          date: user.date,
          phone: user.phone,
          publicAddress: user.publicAddress,
          role: user.role,
          status: user.status,
          kycStatus: user.kycStatus,
          accreditationStatus: user.accreditationStatus,
          amlStatus: user.amlStatus,
          reserveType: user.reserveType || undefined,
          reserveAddress: user.reserveAddress || undefined,
          conversionRatesAddress: user.conversionRatesAddress || undefined,
          investors: user.investors || undefined
        });
      }
    })
    .catch(err => res.status(400).json(err.message));
});

module.exports = router;
