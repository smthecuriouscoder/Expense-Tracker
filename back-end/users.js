const client = require("./client.js");
const nodemailer = require("nodemailer");

let users = []; //array to store all the users
let transactions = []; //array to store all the transactions(income and expense) of a user
let filterArr = []; //array to store the sorted transactions of a particular month of a user
let todayExpense = []; //array to store today expenses if any

function getDetails() {
  getUsers().then((data) => {
    users = data;

    users.forEach((user) => {
      getTransactions(user).then((data) => {
        transactions = data;

        filterArr = filterArrayFx(sort(transactions), new Date());
        console.log("Sending monthly report to: ", user.email);
        sendReportByEmail(user, filterArr);
      });
    });
  });
}

//to get the status whether the user has added any expenses or not
function getStatus() {
  getUsers().then((data) => {
    users = data;

    users.forEach((user) => {
      getTodayExpenses(user).then((data) => {
        todayExpense = data;
        console.log("Expenses for today", todayExpense);
        if (!todayExpense.length) {
          sendNotificationByEmail(user);
        }
      });
    });
  });
}

async function getTodayExpenses(obj) {
  await client.client.connect();

  const cursor = await client.client
    .db("expense_tracker")
    .collection("expense_collection")
    .find({
      type: "Expense",
      created_by: obj.email,
      created_date: {
        $lt: new Date(),
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    });
  const results = await cursor.toArray();

  return results;
}

async function getUsers() {
  await client.client.connect();

  const cursor = await client.client.db("expense_tracker").collection("user_collection").find({});
  const results = await cursor.toArray();

  return results;
}

async function getTransactions(obj) {
  await client.client.connect();

  const cursor = await client.client
    .db("expense_tracker")
    .collection("expense_collection")
    .find({ created_by: obj.email });
  const results = await cursor.toArray();

  return results;
}

const sort = (incomeExpenseArray) =>
  incomeExpenseArray.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

const filterArrayFx = (incomeExpenseArray, date) =>
  incomeExpenseArray.filter((obj) => {
    if (new Date(obj.date).getFullYear() === new Date(date).getFullYear()) {
      if (new Date(obj.date).getMonth() === new Date(date).getMonth()) {
        return obj;
      }
    }
    return null;
  });

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

function sendReportByEmail(userObject, transactionArray) {
  let email = userObject.email;
  let transaction = transactionArray;

  let message =
    "<h2>Hello " +
    userObject.name +
    "</h2>" +
    "<p>Here is the record of your income and expenses for this month: </p>" +
    '<table style="border: 1px solid black; border-collapse: collapse;">' +
    "<thead>" +
    "<tr>" +
    '<th style="border: 1px solid black; border-collapse: collapse;"> Type </th>' +
    '<th style="border: 1px solid black; border-collapse: collapse;"> Date </th>' +
    '<th style="border: 1px solid black; border-collapse: collapse;"> Amount </th>' +
    '<th style="border: 1px solid black; border-collapse: collapse;"> Category </th>' +
    '<th style="border: 1px solid black; border-collapse: collapse;"> Description </th>' +
    '<th style="border: 1px solid black; border-collapse: collapse;"> Type of Account</th>' +
    "</tr>" +
    "</thead>";

  for (const { type, date, amount, category, description, account } of transaction) {
    message +=
      "<tr>" +
      '<td  style="border: 1px solid black; border-collapse: collapse;">' +
      type +
      "</td>" +
      '<td style="border: 1px solid black; border-collapse: collapse;">' +
      date.split(" ").slice(0, 4).join(" ") +
      "</td>" +
      '<td style="border: 1px solid black; border-collapse: collapse;">' +
      "Rs. " +
      amount +
      "</td>" +
      '<td style="border: 1px solid black; border-collapse: collapse;">' +
      (category ? category : "-") +
      "</td>" +
      '<td style="border: 1px solid black; border-collapse: collapse;">' +
      (description ? description : "-") +
      "</td>" +
      '<td style="border: 1px solid black; border-collapse: collapse;">' +
      account +
      "</td>" +
      "</tr>";
  }

  message +=
    "</table>" +
    "<br />" +
    '<span style="font-weight: bold;">Regards,</span> <br />' +
    "<span>Expense Tracker</span>";

  var mail = {
    from: "",
    to: email,
    subject: "Monthly Report",
    html: message,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log("Mail not sent");
    } else {
      console.log("Sent mail");
    }
  });
}

function sendNotificationByEmail(userObject) {
  let email = userObject.email;

  let message =
    "<h2>Hello " +
    userObject.name +
    "</h2>" +
    "<p>Aren't you forgetting something today? Well, come and add your expenditures.</p>" +
    "<a href='http://localhost:3000/login'>Click here</a><br />";

  message +=
    "<br />" +
    '<span style="font-weight: bold;">Regards,</span> <br />' +
    "<span>Expense Tracker</span>";

  var mail = {
    from: "",
    to: email,
    subject: "Reminder",
    html: message,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log("Mail not sent");
    } else {
      console.log("Sent mail");
    }
  });
}

module.exports = { getDetails, getStatus };
