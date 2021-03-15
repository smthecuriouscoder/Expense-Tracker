const client = require('../../client.js');
const nodemailer = require('nodemailer');

let users = [];
let transactions = [];
let filterArr = [];

function getDetails(){  
    getUsers().then(data => {
        users = data

        users.forEach(user => {
            getTransactions(user).then(data => {
                transactions = data

                filterArr = filterArrayFx(sort(transactions), new Date)
                console.log('running a task every minute', user.email)
                sendEmail(user, filterArr)
            })
        })
    })
}

async function getUsers() {
    await client.client.connect();

    const cursor = await client.client.db("expense_tracker").collection("user_collection").find({});
    const results = await cursor.toArray();
    
    return results;
}

async function getTransactions(obj) {
    await client.client.connect();
    
    const cursor = await client.client.db("expense_tracker").collection("expense_collection").find({created_by: obj.email});
    const results = await cursor.toArray();
    
    return results;
}

const sort = (incomeExpenseArray) => (
  incomeExpenseArray.sort( function (a, b){
    return new Date(a.date) - new Date(b.date);
  })
)

const filterArrayFx = (incomeExpenseArray, date) => (
    incomeExpenseArray.filter( obj => {
      if(new Date(obj.date).getFullYear() === new Date(date).getFullYear()) {
          if(new Date(obj.date).getMonth() === new Date(date).getMonth()) {
            return obj;
          }
      }
      return null;
    })
)

let transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: '', 
        pass: ''
    } 
});

function sendEmail(userObject, transactionArray){
    let email = userObject.email;
    let transaction = transactionArray;

    let message = (
        '<h2>Hello ' + userObject.name + '</h2>' +
        '<p>Here is the record of your income and expenses for this month: </p>' +
        '<table style="border: 1px solid black; border-collapse: collapse;">' +
            '<thead>' +
                '<tr>' +
                    '<th style="border: 1px solid black; border-collapse: collapse;"> Type </th>' +
                    '<th style="border: 1px solid black; border-collapse: collapse;"> Date </th>'  +
                    '<th style="border: 1px solid black; border-collapse: collapse;"> Amount </th>'  +
                    '<th style="border: 1px solid black; border-collapse: collapse;"> Category </th>'  +
                    '<th style="border: 1px solid black; border-collapse: collapse;"> Description </th>'  +
                    '<th style="border: 1px solid black; border-collapse: collapse;"> Type of Account</th>'  +
                '</tr>' +
            '</thead>'
    ); 
      
    for(const { type, date, amount, category, description, account } of transaction) {
         message += (
           '<tr>' +
                '<td  style="border: 1px solid black; border-collapse: collapse;">' + type + '</td>' +
                '<td style="border: 1px solid black; border-collapse: collapse;">' + date.split(' ').slice(0, 4).join(' ') + '</td>' +
                '<td style="border: 1px solid black; border-collapse: collapse;">' + 'Rs. ' + amount + '</td>' +
                '<td style="border: 1px solid black; border-collapse: collapse;">' + (category ? category : "-") + '</td>' +
                '<td style="border: 1px solid black; border-collapse: collapse;">' + (description ? description : "-") + '</td>' +
                '<td style="border: 1px solid black; border-collapse: collapse;">' + account + '</td>' +
          '</tr>'
         );
    }
      
    message +=  '</table>' +
                '<br />' +
                '<span style="font-weight: bold;">Regards,</span> <br />' +
                '<span>Expense Tracker</span>';

    var mail = {
      from: '',
      to: email,
      subject: 'Monthly Report',
      html: message,
    };
  
    transporter.sendMail(mail, (err, data) => {
      if (err) {
       console.log("Mail not sent")
      } else {
        console.log("Sent mail")
      }
    });
}

module.exports = { getDetails }