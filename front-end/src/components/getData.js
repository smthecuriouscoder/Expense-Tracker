export const incomeExpenseArrayFx = (income, expenses) => {
  return income
        .concat(expenses)
        .sort ( function (a, b){
          return new Date(a.date) - new Date(b.date);
        });
}

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

export const filterArrayByType = (array, type) => {
  return array.filter( transaction => {
    return transaction.account === type;
  })
}

export const getData = (income, expenses, date) => {
    let incomeExpenseArray = incomeExpenseArrayFx(income, expenses); // sorted array of income and expenses

    const filterArr = filterArrayFx(incomeExpenseArray, date);
  
    return filterArr;
}