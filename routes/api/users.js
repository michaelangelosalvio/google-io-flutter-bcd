const express = require("express");
const router = express.Router();
const User = require("./../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");
const passport = require("passport");
const isEmpty = require("./../../validators/is-empty");
const UserValidation = require("./../../validators/users");
const validateRegisterInput = require("./../../validators/register");
const validateLoginData = require("./../../validators/login");

router.get("/", (req, res) => {});

router.post("/update-password", (req, res) => {
  const { isValid, errors } = UserValidation.validateUpdatePassword(req.body);

  if (!isValid) {
    return res.status(401).json(errors);
  }

  User.findById(req.body.user.id).then(record => {
    if (record) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;

          if (!isEmpty(req.body.password)) {
            record.password = hash;
          }

          record
            .save()
            .then(record => {
              const { name, username, role, _id } = record;
              return res.json({ name, username, role, _id });
            })
            .catch(err => console.log(err));
        });
      });
    } else {
      console.log("ID not found");
    }
  });
});

router.post("/auth", (req, res) => {
  const { isValid, errors } = validateLoginData(req.body);

  if (!isValid) {
    return res.status(401).json(errors);
  }

  User.findOne({
    username: req.body.username
  }).then(user => {
    if (!user) {
      errors["username"] = "Username not found";
      return res.status(401).json(errors);
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        return res.json(user);
      } else {
        return res.status(401).json({ password: "Password is invalid" });
      }
    });
  });
});

router.post("/login", (req, res) => {
  const { isValid, errors } = validateLoginData(req.body);

  if (!isValid) {
    return res.status(401).json(errors);
  }

  User.findOne({
    username: req.body.username
  }).then(user => {
    if (!user) {
      errors["username"] = "Username not found";
      return res.status(401).json(errors);
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user._id,
          username: user.username,
          name: user.name
        };

        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            return res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(401).json({ password: "Password is invalid" });
      }
    });
  });
});

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(401).json(errors);
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(401).json({ username: "Username already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      username: req.user.username
    });
  }
);

module.exports = router;
