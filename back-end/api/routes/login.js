const express = require("express");
const router = express.Router();
var nJwt = require("njwt");
var secureRandom = require("secure-random");
const client = require("../../client.js");
const bcrypt = require("bcrypt");

var sign;

router.post("/", (req, res, next) => {
  //sign in end point
  var signingKey = secureRandom(256, { type: "Buffer" }); // Create a highly random byte array of 256 bytes
  sign = signingKey;
  var claims = {
    iss: "http://localhost:3000/", // The URL of your service
    sub: req.body.email, // The UID of the user in your system
    scope: "self",
  };
  var jwt = nJwt.create(claims, signingKey);

  var email = req.body.email;
  var password = req.body.password;

  signIn(email, password).then((obj) => {
    console.log(obj, "status");
    if (obj && obj.flag === 0) {
      res.status(200).json({
        token: jwt.compact(),
        status: "Success",
        userDetails: { name: obj.name, email: obj.email },
      });
    } else {
      res.status(400).json({
        error: "Bad Request Sagar",
      });
    }
  });
});

async function signIn(email, password) {
  var cursor = await client.client
    .db("expense_tracker")
    .collection("user_collection")
    .find({ email: email });
  var found = await cursor.toArray();
  found = found[0];
  console.log(found, "found");

  let flag = 1;
  //the user has siged up already
  if (found !== undefined) {
    const isMatch = await bcrypt.compare(password, found.password);
    if (!isMatch) {
      console.log("Password doesn't match!");

      return { flag: flag };
    } else {
      flag = 0;
      console.log("Password matches!");

      return { flag: flag, name: found.name, email: found.email, password: found.password };
    }
  }
}

router.post("/signup", async (req, res, next) => {
  const saltPassword = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(req.body.password, saltPassword);

  var obj = {
    name: req.body.name,
    email: req.body.email,
    password: securePassword,
    contact: req.body.contact,
  };

  var result = await signUp(obj);
  console.log(result, "result");
  if (result === 1) {
    //1 record inserted
    res.status(200).json({
      status: "Success",
      userDetails: obj,
    });
  } else {
    res.status(400).json({
      error: "Account already exists for this email address",
    });
  }
});

async function signUp(obj) {
  var result = 0;

  const cursor = await client.client
    .db("expense_tracker")
    .collection("user_collection")
    .find({ email: obj.email });
  const found = await cursor.toArray();

  console.log(found, "found");
  if (found.length === 0) {
    const cursor = await client.client
      .db("expense_tracker")
      .collection("user_collection")
      .insertOne(obj);
    result = 1;
  } else {
    result = 0;
  }

  return result;
}

router.post("/verify", (req, res, next) => {
  try {
    verifiedJwt = nJwt.verify(req.body.token, sign);
    console.log(verifiedJwt);
  } catch (e) {
    console.log(e);
  }

  res.status(200).json({
    email: verifiedJwt.body.sub,
  });
});

module.exports = router;
