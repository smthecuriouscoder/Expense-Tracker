const express = require("express");
const cors = require("cors");
//const client = require("./client.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

// main();

// async function main() {
//   await client.client.connect();
//   const cursor = await client.client
//     .db("mayank_db")
//     .collection("testing_collection")
//     .find({ name: "Vikram" });
//   const results = await cursor.toArray();
//   console.log(results);
// }

// const productRoutes = require("./api/routes/products");
const loginRoutes = require("./api/routes/login");
const etRoutes = require("./api/routes/etRoutes");

// app.use("/products", productRoutes);

app.use("/login", loginRoutes);
app.use("/etRoutes", etRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
