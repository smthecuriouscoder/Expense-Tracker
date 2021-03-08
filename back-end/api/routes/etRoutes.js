const express = require('express');
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');
const router = express.Router();
const client = require('../../client.js');

let transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'email', 
        pass: 'password'
    } 
});

router.post('/sendEmail', (req, res, next) => {
    // var name = req.body.name
    var email = req.body.email

    var mail = {
      from: 'sagarmittal555@gmail.com',
      to: email,
      subject: 'Monthly Report',
      html:
       `<h2>Monthly Report</h2>
       <p>Here is the record of your income and expenses: </p>
       <table>
        <thead>
            <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type of Account</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Income</td>
                <td>Rs. 1000</td>
                <td>Salary</td>
                <td>Personal</td>
            </tr>
            <tr>
                <td>Expense</td>
                <td>Rs. 100</td>
                <td>Fruits</td>
                <td>Personal</td>
            </tr>
        </tbody
       </table>
       `,
    }
  
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          status: 'fail'
        })
      } else {
        res.json({
         status: 'success'
        })
      }
    })
})

router.get('/', (req, res, next) => {
    res.status(200).json({
        messages: 'Handling GET requests to /etRoutes'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        messages: 'Handling POST requests to /etRoutes'
    });
});

router.post('/updatePassword', (req, res, next) => {
    var obj = {
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm
    }

    if (obj.password == obj.confirm) {
        res.status(200).json({
            messages: 'Handling Password Updation requests to /etRoutes',
            password: req.body.password
        });
    }
    else {
        res.status(400).json({
            messages: 'Gadbad',
            password: req.body.password
        });
    }
});

router.post('/updateDetails', (req, res, next) => {
    res.status(200).json({
        status: "Success",
        request: req.body
    });
});

router.post('/incomeDialogGet', (req, res, next) => {
    var obj = {
        created_by: req.body.email,
        type: 'Income'
    }

    var results = []

    getExpense(obj).then(data => {
        results = data
    }).then(() => {
        console.log(results, 'results in incomedialog get')

        res.status(200).json({
            status: "Success",
            request: obj,
            income: results
        });
    })

});

router.post('/incomeDialog', (req, res, next) => {

    var obj = {
        date: req.body.form.date,
        amount: req.body.form.amount,
        category: req.body.form.category,
        description: req.body.form.description,
        account: req.body.form.account,
        type: 'Income',
        isActive: true,
        created_by: req.body.email,
        created_date: new Date,
        modified_by: req.body.email,
        modified_date: new Date
    }

    postAmount(obj)

    res.status(200).json({
        status: "Success",
        request: obj
    });
});

router.delete('/incomeDialog', (req, res, next) => {
    var obj = {
        type: req.body.type,
        date: req.body.date
    }

    var results = []

    deleteData(obj)
    .then(
        getArray(obj).then(data => {
            results = data
        }).then(() => {
            console.log(results, 'after deleting data')

            res.status(200).json({
                status: "Success",
                request: obj,
                expenses: results
            });
        })
    )
});

router.post('/expenseDialogGet', (req, res, next) => {

    var obj = {
	    created_by: req.body.email,
        type: 'Expense'
    }

    var results = []

    getExpense(obj).then(data => {
        results = data
    }).then(() => {
        console.log(results, 'results in expensedialog get')

        res.status(200).json({
            status: "Success",
            request: obj,
            expenses: results
        });
    })

});

router.post('/expenseDialog', (req, res, next) => {

    var obj = {
        date: req.body.form.date,
        amount: req.body.form.amount,
        category: req.body.form.category,
        description: req.body.form.description,
        account: req.body.form.account,
        type: 'Expense',
        isActive: true,
        created_by: req.body.email,
        created_date: new Date,
        modified_by: req.body.email,
        modified_date: new Date
    }

    postAmount(obj)

    res.status(200).json({
        status: "Success",
        request: obj
    });
});

router.post('/estimatedSavingsDialogGet', (req, res, next) => {

    var obj = {
	    created_by: req.body.email,
        type: 'Target Savings'
    }

    var results = []

    getExpense(obj).then(data => {
        results = data
    }).then(() => {
        console.log(results, 'results in estimatedsavingsdialog get')

        res.status(200).json({
            status: "Success",
            request: obj,
            estimatedSavings: results
        });
    })

});

router.post('/estimatedSavingsDialog', (req, res, next) => {

    var obj = {
        date: req.body.form.date,
        amount: req.body.form.amount,
        account: req.body.form.account,
        type: 'Target Savings',
        isActive: true,
        created_by: req.body.email,
        created_date: new Date,
        modified_by: req.body.email,
        modified_date: new Date
    }

    postAmount(obj)

    res.status(200).json({
        status: "Success",
        request: obj
    });
});

async function postAmount(object) {
    await client.client.connect()

    const cursor = await client.client.db("expense_tracker").collection("expense_collection").insertOne(object)
    .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))

}

async function deleteData(object) {
    await client.client.connect()

    await client.client.db("expense_tracker").collection("expense_collection").deleteOne(object)
    .then(result => console.log(`Deleted ${result.deletedCount} item.`))
    
}

async function getExpense(object) {
    await client.client.connect();

    console.log(object.type, 'object.type');
    const cursor = await client.client.db("expense_tracker").collection("expense_collection").find({ type: object.type, created_by: object.created_by });
    const results = await cursor.toArray();

    return results;
}

async function getArray(object) {
    await client.client.connect()

    const cursor = await client.client.db("expense_tracker").collection("expense_collection").find({ _id: object._id})
    const results = await cursor.toArray();

    return results
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
