import React from 'react';
import { Card, CardContent } from '@material-ui/core';
import IncomeExpenseChart from './IncomeExpenseChart';
import ExpenseChart from './ExpenseChart';
import SavingsProgress from './SavingsProgress';
import cssstyles from '../styles/Dashboard.module.css';

function CardCollection({ income, expenses, estimatedSavings }){
  //for finding the balance
  const Balance = () => {
	let incomeAmount = 0;
	let expenseAmount = 0;
	
	if(income.length > 0){
		incomeAmount = income.reduce((accumulator, currentValue) => {
                			  return (accumulator += currentValue ? parseInt(currentValue.amount) : 0)
              				}, 0);
	}
	if(expenses.length > 0){
		expenseAmount = expenses.reduce((accumulator, currentValue) => {
                			  return (accumulator += currentValue ? parseInt(currentValue.amount) : 0)
              				}, 0);
	}
	return incomeAmount - expenseAmount;
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let totalEstimatedSavings = 0;

  if(income.length > 0){
		totalIncome=income.reduce((accumulator, currentValue) => {
                			  return (accumulator += currentValue ? parseInt(currentValue.amount) : 0)
              				}, 0);
  }
  if(expenses.length > 0){
		totalExpense=expenses.reduce((accumulator, currentValue) => {
                			  return (accumulator += currentValue ? parseInt(currentValue.amount) : 0)
              				}, 0);
  }
  if(estimatedSavings.length > 0){
	totalEstimatedSavings=estimatedSavings.reduce((accumulator, currentValue) => {
						  return (accumulator += currentValue ? parseInt(currentValue.amount) : 0)
						  }, 0);
  }

  //let amountPercentage = Balance() <= 0 ? 0 : (Balance() / (totalIncome !== 0 ? totalIncome : 1));
  let cardStyle; 

  if(Balance() >= totalEstimatedSavings){
    cardStyle = {
		backgroundColor: 'hsl(120, 82%, 33%)'	//green color
    }
  }
  else{
    cardStyle = {
    	backgroundColor: 'red'	//red color
    }
  }
  
  return (
	<div>
		<div className={cssstyles.papers}>
			<Card raised elevation={23} className={cssstyles.card}>
				<CardContent className={cssstyles.cardContent}>
					<h2 style={{textAlign: 'center'}}>Stats</h2>
					<div className={cssstyles.incExpContainer}>
						<div className={cssstyles.handleOverflow}>
							<h4 className={cssstyles.incomeRs}>Income</h4>
							<p className={`${cssstyles.money} ${cssstyles.plus}`}>Rs. {totalIncome}</p>
						</div>
						<div className={cssstyles.handleOverflow}>
							<h4 className={cssstyles.incomeRs}>Expense</h4>
							<p className={`${cssstyles.money} ${cssstyles.minus}`}>Rs. {totalExpense}</p>
						</div>
					</div>
					<CallIncExpChart totalIncome={totalIncome}  totalExpense={totalExpense} totalEstimatedSavings={totalEstimatedSavings} balance={Balance} />
				</CardContent>
			</Card>

			<Card raised elevation={23} className={cssstyles.card} style={{flexGrow: '5'}}>
				<CardContent className={cssstyles.cardContent}>
					<h2 style={{textAlign: 'center'}}>CategoryWise Expenses</h2>
					<CallExpChart expensesArray={expenses} />
				</CardContent>
			</Card>
			
			{/* <div className={cssstyles.smallPapers}>
				<Card raised className={cssstyles.smallCard} style={{backgroundColor: "hsl(120, 82%, 33%)"}} >
					<CardHeader title="Balance" subheader={<span style={{color: 'white', fontSize: '25px'}}>Rs. {Balance()}</span>} avatar={<AccountBalanceIcon />} style={{color: 'white'}} />
					<CardContent>
						<GaugeChart 
							id="gauge-chart1" 
							colors={["red","#f4c70f","#10e110"]} 
							percent={Number(amountPercentage.toFixed(2))} 
						/>
					</CardContent>
				</Card>
			</div> */}
		</div>
		<div className={cssstyles.savingsProgress}>
		  <SavingsProgress totalEstimatedSavings={totalEstimatedSavings} Balance={Balance()} status={cardStyle} />
		</div>
	</div>
  );
}

function CallIncExpChart({totalIncome, totalExpense, totalEstimatedSavings, balance}) {
  return (
    <div style={{flexGrow: '2', padding: '5px', margin: '10px 0'}}>
      {(totalIncome || totalExpense) ? <IncomeExpenseChart incomeObject = {totalIncome} expenseObject = {totalExpense} balance={balance} /> : null}
    </div>
  );
}

function CallExpChart({ expensesArray }) {
	return (
	  <div style={{flexGrow: '2', padding: '5px', margin: '10px 0'}}>
		{ expensesArray ? <ExpenseChart expensesArray = {expensesArray} /> : null}
	  </div>
	);
}

export default CardCollection;