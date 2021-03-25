//function to concatenate income and expense array and then sort it
export const incomeExpenseArrayFx = (income, expenses) => {
  return income.concat(expenses).sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
};

//function to filter income and expense array by date
export const filterArrayFx = (incomeExpenseArray, date) =>
  incomeExpenseArray.filter((obj) => {
    if (new Date(obj.date).getFullYear() === new Date(date).getFullYear()) {
      if (new Date(obj.date).getMonth() === new Date(date).getMonth()) {
        return obj;
      }
    }
    return null;
  });

//function to filter income and expense array by year
export const filterArrayByYearFx = (incomeorExpenseArray, date) =>
  incomeorExpenseArray.filter((obj) => {
    if (new Date(obj.date).getFullYear() === new Date(date).getFullYear()) {
      return obj;
    }
    return null;
  });

//function to filter array by account type (Personal or Business)
export const filterArrayByType = (array, type) => {
  return array.filter((transaction) => {
    return transaction.account === type;
  });
};

export const getData = (income, expenses, date) => {
  let incomeExpenseArray = incomeExpenseArrayFx(income, expenses); // sorted array of income and expense

  const filterArr = filterArrayFx(incomeExpenseArray, date);

  return filterArr;
};

export const filterArrayByMonth = (incomeorExpenseArray) => {
  //filter array by month
  const monthlyAmount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  incomeorExpenseArray.forEach((obj) => {
    switch (new Date(obj.date).getMonth()) {
      case 0:
        monthlyAmount[0] += +obj.amount;
        break;
      case 1:
        monthlyAmount[1] += +obj.amount;
        break;
      case 2:
        monthlyAmount[2] += +obj.amount;
        break;
      case 3:
        monthlyAmount[3] += +obj.amount;
        break;
      case 4:
        monthlyAmount[4] += +obj.amount;
        break;
      case 5:
        monthlyAmount[5] += +obj.amount;
        break;
      case 6:
        monthlyAmount[6] += +obj.amount;
        break;
      case 7:
        monthlyAmount[7] += +obj.amount;
        break;
      case 8:
        monthlyAmount[8] += +obj.amount;
        break;
      case 9:
        monthlyAmount[9] += +obj.amount;
        break;
      case 10:
        monthlyAmount[10] += +obj.amount;
        break;
      case 11:
        monthlyAmount[11] += +obj.amount;
        break;
      default:
        break;
    }
  });

  return monthlyAmount;
};

export const MonthWiseData = (incomeorExpenseArray) => {
  const res = filterArrayByMonth(incomeorExpenseArray);

  return res;
};

export const getMonthNames = (arr, max) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let maxValues = [];
  arr.forEach((val, i) => {
    if (val === max) {
      maxValues.push(months[i]);
    }
  });
  return maxValues;
};
