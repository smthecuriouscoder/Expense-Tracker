const express = require('express');
const router = express.Router();
var nJwt = require('njwt');
var secureRandom = require('secure-random');
const client = require('../../client.js');
const bcrypt = require('bcrypt');

var sign;

router.post('/', (req, res, next) => {

    var signingKey = secureRandom(256, { type: 'Buffer' }); // Create a highly random byte array of 256 bytes
    sign = signingKey
    var claims = {
        iss: "http://localhost:3000/",  // The URL of your service
        sub: req.body.email,    // The UID of the user in your system
        scope: "self"
    }

    var jwt = nJwt.create(claims, signingKey);

    res.status(200).json({
        token: jwt.compact(),
        status: "Success",
        request: req.body
    });
});

router.post('/signup', async (req, res, next) => {

    const saltPassword = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, saltPassword);

    var obj = {
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        contact: req.body.contact
    }

    var result = signUp(obj)
    console.log(result, 'result')

    res.status(200).json({
        status: "Success",
        userDetails: obj
    });

});

async function signUp(obj) {
    await client.client.connect()
    var result = 0
    var found = await client.client.db("expense_tracker").collection("user_collection").find({ email: obj.email });
    console.log(found, 'found')
    if (found) {
        const cursor = await client.client.db("expense_tracker").collection("user_collection").insertOne(obj);
        result = 1
    }
    else {
        result = 0
    }

    return result
}



router.post('/verify', (req, res, next) => {

    try {
        verifiedJwt = nJwt.verify(req.body.token, sign);
    } catch (e) {
        console.log(e);
    }

    res.status(200).json({
        email: verifiedJwt.body.sub
    });
});

module.exports = router;