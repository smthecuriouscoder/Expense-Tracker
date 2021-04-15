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

  var { email, password } = req.body;

  signIn(email, password).then((obj) => {
    if (obj && obj.isPasswordMatch === true) {
      res.status(200).json({
        token: jwt.compact(),
        status: "Success",
        userDetails: { name: obj.name, email: obj.email },
      });
    } else {
      res.status(400).json({
        error: "Invalid email or password",
      });
    }
  });
});

async function signIn(email, password) {
  var cursor = await client.client
    .db("expense_tracker")
    .collection("user_collection")
    .findOne({ email: email });

  var user = cursor;
  console.log(user, "User");

  //the user has siged up already
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password doesn't match!");

      return { isPasswordMatch: false };
    } else {
      console.log("Password matches!");

      return { isPasswordMatch: true, name: user.name, email: user.email };
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
      userDetails: { name: obj.name, email: obj.email },
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
