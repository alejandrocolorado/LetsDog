const express = require("express");
const router = express.Router();

const prices = require("./../config/prices");
const User = require("../models/User");
const Carer = require("../models/Carer");
const Card = require("../models/Card");

// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//       next();
//       return;
//     }

//     res.redirect('auth/login');
//   });

router.get("/service", (req, res, next) => {
  res.render("service", { intervalList: prices });
});

router.get("/setup", (req, res, next) => {
  res.render("setup");
});

router.get("/carer-profile/:id", (req, res, next) => {
  const carerId = req.params.id;
  console.log(carerId);

  Carer.findOne({ _id: carerId })
    .then((carer) => {
      console.log(carer);
      res.render("carer-profile", { selectedCarer: carer });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/validation", (req, res, next) => {
  res.render("service-validation");
});

router.get("/confirmation", (req, res, next) => {
  res.render("service-confirmation");
});

router.get("/payment", (req, res, next) => {
  res.render("payment-method");
});

router.post("/payment", (req, res, next) => {
  const { name, number, expiresMonth, expiresYear, cvv, saveCard } = req.body;
  console.log(name)
  
  if (
    name === "" ||
    number === "" ||
    expiresMonth === "" ||
    expiresYear === "" ||
    cvv === ""
  ) {
    res.render("/payment", { err: "Te faltan campos, por favor llenalos" });
    return;
  }

  if (saveCard == true) {
    Card.createOne({
      ownerName: name,
      cardNumber: number,
      expiration: expiresMonth + expiresYear,
      cvv: cvv,
    })
      .then (() => {
        res.redirect('/login')
      })
      .catch((err) => {
        console.log(err)
      });
  } else {
    console.log('No se guardo nada nadita nada')
  }
  
});
// ownerName: String,
//   cardNumber: Number,
//   expiration:Number,
//   cvv: Number,

module.exports = router;
