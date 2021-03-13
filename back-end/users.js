const client = require('../../client.js');

let users = [];
let transactions = [];

getDetails();

function getDetails(){
  
    getUsers().then(data => {
        users = data
        console.log(users, 'results in users')

        users.forEach(user => {
            getTransactions(user).then(data => {
                transactions = data
                console.log(transactions, 'results in transactions')

                console.log(filterArrayFx(sort(transactions), new Date), 'filter array')
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
