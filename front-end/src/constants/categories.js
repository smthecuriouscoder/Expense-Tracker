const expenseCategoryColors = ["#FF6347", "#FFA500", "#FFFF00", "#9400D3", "#8B4513", "#FF3333", "#2193b0", "#900C3F", "#0066CC", "#000075", "#551011", "#7F00FF", "#cf0a87"];

export const incomeCategories = [
  { type: 'Salary', amount: 0 },
  { type: 'Investments', amount: 0 },
  { type: 'Extra income', amount: 0 },
  { type: 'Deposits', amount: 0 },
  { type: 'Lottery', amount: 0 },
  { type: 'Gifts', amount: 0 },
  { type: 'Savings', amount: 0 },
  { type: 'Rental income', amount: 0 },
];

export const expenseCategories = [
  { type: 'Bills', amount: 0, color: expenseCategoryColors[0] },
  { type: 'Car', amount: 0, color: expenseCategoryColors[1] },
  { type: 'Clothes', amount: 0, color: expenseCategoryColors[2] },
  { type: 'Travel', amount: 0, color: expenseCategoryColors[3] },
  { type: 'Food', amount: 0, color: expenseCategoryColors[4] },
  { type: 'Fruits', amount: 0, color: expenseCategoryColors[5] },
  { type: 'Vegetables', amount: 0, color: expenseCategoryColors[6] },
  { type: 'Shopping', amount: 0, color: expenseCategoryColors[7]},
  { type: 'House', amount: 0, color: expenseCategoryColors[8] },
  { type: 'Entertainment', amount: 0, color: expenseCategoryColors[9] },
  { type: 'Phone', amount: 0, color: expenseCategoryColors[10] },
  { type: 'Pets', amount: 0, color: expenseCategoryColors[11] },
  { type: 'Other', amount: 0, color: expenseCategoryColors[12] },
];

export const resetCategories = () => {
  expenseCategories.forEach((c) => c.amount = 0);
};