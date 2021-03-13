//function to concatenate income and expense array and then sort it
export const incomeExpenseArrayFx = (income, expenses) => {
  return income
        .concat(expenses)
        .sort ( function (a, b){
          return new Date(a.date) - new Date(b.date);
        });
}

//function to filter income and expense array by date
export const filterArrayFx = (incomeExpenseArray, date) => (
  incomeExpenseArray.filter( obj => {
    if(new Date(obj.date).getFullYear() === new Date(date).getFullYear()) {
        if(new Date(obj.date).getMonth() === new Date(date).getMonth()) {
          return obj;
        }
    }
    return null;
  })
)

//function to filter array by account type (Personal or Business)
export const filterArrayByType = (array, type) => {
  return array.filter( transaction => {
    return transaction.account === type;
  })
}

export const getData = (income, expenses, date) => {
    let incomeExpenseArray = incomeExpenseArrayFx(income, expenses); // sorted array of income and expense

    const filterArr = filterArrayFx(incomeExpenseArray, date);
  
    return filterArr;
}