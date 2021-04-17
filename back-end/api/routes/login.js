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
    if (obj !== undefined) {
      if (obj.isPasswordMatch === true) {
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
    } else {
      res.status(400).json({
        error: "Your email is not registered",
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
  if (user && password) {
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
    createSettings(obj.email);
    result = 1;
  } else {
    result = 0;
  }

  return result;
}

async function createSettings(email) {
  const obj = {
    email: email,
    isEmailChecked: false,
    isReportChecked: true,
  };

  const cursor = await client.client
    .db("expense_tracker")
    .collection("user_settings_collection")
    .insertOne(obj);

  console.log(cursor.ops);
}

router.get("/updateSettings/:email", async (req, res) => {
  var cursor = await client.client
    .db("expense_tracker")
    .collection("user_settings_collection")
    .findOne({ email: req.params.email });
  console.log(cursor);
  res.status(200).json({
    status: "Success",
    request: cursor,
  });
});

router.put("/updateSettings", async (req, res) => {
  const { email, isEmailChecked, isReportChecked } = req.body;

  var cursor = await client.client
    .db("expense_tracker")
    .collection("user_settings_collection")
    .updateOne(
      { email: email },
      { $set: { isEmailChecked: isEmailChecked, isReportChecked: isReportChecked } }
    );
  console.log(cursor.modifiedCount);
  res.status(200).json({
    status: "Success",
    request: req.body,
  });
});

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
