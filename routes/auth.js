const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");

const bcrypt = require("bcrypt");
const { route } = require(".");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { err: "" });
});

router.post("/signup", (req, res, next) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };
  const dogData = {
    photo: req.body.photo,
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
    breed: req.body.breed,
    size: req.body.size,
    behavior: { withDogs: req.body.withDogs, withPeople: req.body.withPeople },
  };

  if (email === "" || password === "") {
    res.send("auth/signup", { err: "Llename esos campos porfa!" });
    return;
  }

  User.findOne({ email }).then((userEmail) => {
    if (userEmail !== null) {
      res.render("auth/signup-user", {
        errorMessage: "El email ya existe, intenta con otro!",
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ email, password: hashPass })
      .then(() => {
        res.redirect("/service");
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

const parser = require("./../config/cloudinary");

router.get("/signup/test-photo", (req, res, next) => {
  res.render("auth/signup-testAxios");
});

router.post("/signup/test-photo", parser.single("image"), (req, res, next) => {
  const image_url = req.file.secure_url;
  res.send(image_url);
});

module.exports = router;