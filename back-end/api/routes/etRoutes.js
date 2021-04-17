const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const cron = require("node-cron");
const client = require("../../client.js");
const { getDetails, getStatus } = require("../../users.js");
const bcrypt = require("bcrypt");

// cron.schedule("0 0 1 * *", function () {
//   getDetails();
// });

// cron.schedule("0 21 * * *", function () {
//   getStatus();
// });

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /etRoutes",
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling POST requests to /etRoutes",
  });
});

router.post("/updatePassword", async (req, res, next) => {
  var obj = {
    email: req.body.email,
    password: req.body.password,
    confirm: req.body.confirm,
  };

  if (obj.password == obj.confirm) {
    const securePassword = await updatePassword(obj);

    res.status(200).json({
      message: "Password Updated Successfully",
      password: securePassword,
    });
  } else {
    res.status(400).json({
      message: "Passwords don't match",
      password: req.body.password,
    });
  }
});

async function updatePassword(obj) {
  const saltPassword = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(obj.password, saltPassword);

  const cursor = await client.client
    .db("expense_tracker")
    .collection("user_collection")
    .updateOne({ email: obj.email }, { $set: { password: securePassword } });
  console.log(cursor.modifiedCount);
  return securePassword;
}

router.post("/updateDetails", (req, res, next) => {
  res.status(200).json({
    status: "Success",
    request: req.body,
  });
});

router.post("/incomeDialogGet", (req, res, next) => {
  var obj = {
    created_by: req.body.email,
    type: "Income",
  };

  var results = [];

  getExpense(obj)
    .then((data) => {
      results = data;
    })
    .then(() => {
      console.log(results, "results in incomedialog get");

      res.status(200).json({
        status: "Success",
        request: obj,
        income: results,
      });
    });
});

router.post("/incomeDialog", (req, res, next) => {
  var obj = {
    date: req.body.form.date,
    amount: req.body.form.amount,
    category: req.body.form.category,
    description: req.body.form.description,
    account: req.body.form.account,
    type: "Income",
    isActive: true,
    created_by: req.body.email,
    created_date: new Date(),
    modified_by: req.body.email,
    modified_date: new Date(),
  };

  postAmount(obj);

  res.status(200).json({
    status: "Success",
    request: obj,
  });
});

router.delete("/incomeDialog", (req, res, next) => {
  var obj = {
    type: req.body.type,
    date: req.body.date,
  };

  var results = [];

  deleteData(obj).then(
    getArray(obj)
      .then((data) => {
        results = data;
      })
      .then(() => {
        console.log(results, "after deleting data");

        res.status(200).json({
          status: "Success",
          request: obj,
          expenses: results,
        });
      })
  );
});

router.post("/expenseDialogGet", (req, res, next) => {
  var obj = {
    created_by: req.body.email,
    type: "Expense",
  };

  var results = [];

  getExpense(obj)
    .then((data) => {
      results = data;
    })
    .then(() => {
      console.log(results, "results in expensedialog get");

      res.status(200).json({
        status: "Success",
        request: obj,
        expenses: results,
      });
    });
});

router.post("/expenseDialog", (req, res, next) => {
  var obj = {
    date: req.body.form.date,
    amount: req.body.form.amount,
    category: req.body.form.category,
    description: req.body.form.description,
    account: req.body.form.account,
    type: "Expense",
    isActive: true,
    created_by: req.body.email,
    created_date: new Date(),
    modified_by: req.body.email,
    modified_date: new Date(),
  };

  postAmount(obj);

  res.status(200).json({
    status: "Success",
    request: obj,
  });
});

router.post("/estimatedSavingsDialogGet", (req, res, next) => {
  var obj = {
    created_by: req.body.email,
    type: "Target Savings",
  };

  var results = [];

  getExpense(obj)
    .then((data) => {
      results = data;
    })
    .then(() => {
      console.log(results, "results in estimatedsavingsdialog get");

      res.status(200).json({
        status: "Success",
        request: obj,
        estimatedSavings: results,
      });
    });
});

router.post("/estimatedSavingsDialog", (req, res, next) => {
  var obj = {
    date: req.body.form.date,
    amount: req.body.form.amount,
    account: req.body.form.account,
    type: "Target Savings",
    isActive: true,
    created_by: req.body.email,
    created_date: new Date(),
    modified_by: req.body.email,
    modified_date: new Date(),
  };

  postAmount(obj);

  res.status(200).json({
    status: "Success",
    request: obj,
  });
});

async function postAmount(object) {
  const cursor = await client.client
    .db("expense_tracker")
    .collection("expense_collection")
    .insertOne(object)
    .then((result) => console.log(`Successfully inserted item with _id: ${result.insertedId}`));
}

async function deleteData(object) {
  await client.client
    .db("expense_tracker")
    .collection("expense_collection")
    .deleteOne(object)
    .then((result) => console.log(`Deleted ${result.deletedCount} item.`));
}

async function updateDetails() {
  await client.client.db("expense_tracker").collection("user_collection").updateOne();
}

async function getExpense(object) {
  console.log(object.type, "object.type");
  const cursor = await client.client
    .db("expense_tracker")
    .collection("expense_collection")
    .find({ type: object.type, created_by: object.created_by });
  const results = await cursor.toArray();

  return results;
}

async function getArray(object) {
  const cursor = await client.client
    .db("expense_tracker")
    .collection("expense_collection")
    .find({ _id: object._id });
  const results = await cursor.toArray();

  return results;
}

// router.get('/incomeExpenseChart', (req, res, next) => {

//     res.status(200).json({
//         status: "Success",
//         request: req.body,
//         totalIncome: 500,
//         totalExpense: 500
//     });
// });

// router.get('/:productId', (req, res, next) => {
//     const id = req.params.productId;
//     if (id == 'special') {
//         res.status(200).json({
//             message: 'Special',
//             id: id
//         })
//     }
//     else {
//         res.status(200).json({
//             message: 'Normal'
//         })
//     }
// })

module.exports = router;
