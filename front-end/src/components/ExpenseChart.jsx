import React, { Component } from 'react';
import { incomeExpenseArrayFx } from './getData';
import { Doughnut } from 'react-chartjs-2';
import { expenseCategories, resetCategories } from '../constants/categories';

//let expenseAmount;

// function getExpenseAmount(expensesArray) {
//   let expenseAmountArray = [];
  
//   for(let i = 0; i < expensesArray.length; i++) {
//     const index = expensesArray.findIndex( innerExpense => innerExpense.category === expensesArray[i].category);
//     if(index !== i){
//       let amount = +expensesArray[index].amount + +expensesArray[i].amount;
//       expenseAmountArray.splice(index,1,amount)
//       expensesArray.splice(i,1)
//       i--;
//       expensesArray[index].amount = amount.toString(); 
//     }
//     else{
//       expenseAmountArray.push(+expensesArray[i].amount);
//     }
//   }

//   return expenseAmountArray;
// }

function getExpenseCategories(expensesArray){
  resetCategories();
  expensesArray.forEach((expense) => {
    const category = expenseCategories.find((c) => c.type === expense.category)

    if(category){
      category.amount += +expense.amount
    }
  })

  return expenseCategories.filter((c) => c.amount > 0)
}

class ExpenseChart extends Component{
  constructor(props) {
    super(props);

    this.state = {
      expensesArray: []
    }
  }

  static getDerivedStateFromProps(props) {    
    return {
      expensesArray: incomeExpenseArrayFx([],props.expensesArray)
    }
  }

  // getRandomColor = () => {
  //   var randomColors = [];
    
  //   for(let i = 0; i < expenseAmount.length; i++) {
  //     randomColors.push("#" + Math.floor(Math.random()*16777215).toString(16))
  //   }

  //   return randomColors;
  // }

  render() {
    //const expenses = this.state.expensesArray.map(expense => expense.category).filter((expense, i, a) => a.indexOf(expense) === i);
    
    // expenseAmount = getExpenseAmount(this.state.expensesArray
    //                                       .map(expense => ({ 
    //                                             category: expense.category, 
    //                                             amount: expense.amount 
    //                                           })
    //                                       ));
 
    const filteredCategories = getExpenseCategories(this.state.expensesArray);
    
    const data = {
	    labels: filteredCategories.map((c) => c.type),
      datasets: [
            {
                label: "Expenses Chart",
                data: filteredCategories.map((c) => c.amount),
                backgroundColor: filteredCategories.map((c) => c.color),
                borderColor: Array(this.state.expensesArray.length).fill("#000"),
                borderWidth: Array(this.state.expensesArray.length).fill(1)
            }
	    ]
    }
    
    const options = {
	    maintainAspectRatio: false,
      tooltips: {
        callbacks: {
            label: function (tooltipItems, data) {
                var label;
                label = data.labels[tooltipItems.index] + ': Rs. ' + data.datasets[0].data[tooltipItems.index];
                return label;
            }
        }
      },
    }
    
    return (
      <div style={{width: '100%', height: '100%', margin: '0 auto'}}>
        <Doughnut
          data={data}
          options={options}
        />
      </div>
    );
  }
}

export default ExpenseChart;