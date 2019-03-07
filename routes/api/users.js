const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");
const validateInput = require("../../validations/input");
const validateJwt = require("../../validations/jwt");

function generateUserObject(user) {
  return {
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
    investors: user.investors.length > 0 ? user.investors : undefined
  };
}

// @route POST api/users/register
// @desc register a user
// @access Public
router.post("/register", (req, res) => {
  const { expired, brokerId, email } = validateJwt(req);
  if (expired) {
    return res.status(400).json({ message: "Token has expired" });
  }
  if (email != req.body.email) {
    return res.status(400).json({ message: "Email doesn't match" });
  }
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
              phone: req.body.phone,
              date: new Date(),
              publicAddress: req.body.publicAddress
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                User.findById(brokerId).then(broker => {
                  const investor = {
                    name: req.body.firstName,
                    address: req.body.publicAddress
                  };
                  broker.investors.push(investor);
                  broker
                    .save()
                    .then(broker => {
                      newUser
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
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const usernameOrEmail = req.body.usernameOrEmail;
  const password = req.body.password;
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
                    ...generateUserObject(user)
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
                  ...generateUserObject(user)
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

router.get("/", (req, res) => {
  const { errors, isValid } = validateInput(req.query, "id");
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const user_id = req.query.id;
  User.findById(user_id)
    .then(user => {
      if (!user) {
        errors.id = "user not found";
        return res.status(400).json(errors);
      } else {
        return res.status(200).json(generateUserObject(user));
      }
    })
    .catch(err => res.status(500).json(err.message));
});

// @route GET/users/pulicAddress
// @desc get user by public address
// @access Public

router.get("/public_address", (req, res) => {
  const { errors, isValid } = validateInput(req.query, "public_address");
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { public_address } = req.query;
  User.findOne({ publicAddress: public_address })
    .then(user => {
      if (!user) {
        errors.publicAddress = "user not found";
        return res.status(400).json(errors);
      } else {
        return res.status(200).json(generateUserObject(user));
      }
    })
    .catch(err => res.status(500).json(err.message));
});

router.patch("/status", (req, res) => {
  const { errors: bodyErrors, isValid: bodyValidity } = validateInput(req.body, "status");
  if (!bodyValidity) {
    return res.status(400).json(bodyErrors);
  }
  const { errors: bodyErrors2, isValid: bodyValidity2 } = validateInput(req.body, "field");
  if (!bodyValidity2) {
    return res.status(400).json(bodyErrors2);
  }
  const { expired, id } = validateJwt(req);
  if (expired) {
    return res.status(400).json({ message: "Token has expired" });
  }
  const user_id = id;
  const status = req.body.status;
  const field = req.body.field;
  // Don't use findByIdAndUpdate since it skips schema validations
  // status validation is done automatically because of mongoose
  User.findById(user_id)
    .then(user => {
      // Update user with the available fields
      const itemField = User.schema.path(field);
      if (itemField) {
        user[field] = status;
        if (user.kycStatus === "APPROVED" && user.amlStatus === "APPROVED" && user.accreditationStatus === "APPROVED") {
          user["status"] = "APPROVED";
        }
        user.save((saveErr, updatedUser) => {
          if (saveErr) return res.status(500).json(saveErr.message);
          res.json(generateUserObject(updatedUser));
        });
      } else res.status(400).json({ message: "field doesn't exist" });
    })
    .catch(err => res.status(500).json(err.message));
});

module.exports = router;
