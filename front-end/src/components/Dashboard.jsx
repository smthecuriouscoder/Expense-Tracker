import React, { Component } from 'react';
import Drawer from './Drawer';
import Filters from './Filters';
import IncomeDialog from './Incomedialog';
import EstimatedSavingsDialog from './Estimatedsavingsdialog';
import ExpenseDialog from './Expensedialog';
import CardCollection from './CardCollection';
import FilterTable from './filter-table';
import Notifier from './Notifier';
import { Button, Snackbar, CircularProgress } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import cssstyles from '../styles/Dashboard.module.css';
import { withStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import axios from 'axios';
import { incomeDialogGet, expenseDialogGet, estimatedSavingsDialogGet } from './apiurl.jsx';
import { filterArrayByType } from './getData.js';
//import { sendEmail } from './apiurl.jsx';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(5),
  },
  header: {
    display: 'flex',
  },
  circularProgressContainer: {
	display: 'flex', 
	justifyContent: 'center', 
	height: '100vh',  
	width: '100%'
  },
  containedGreen: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],      
    }
  },
  containedRed: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],      
    }
  }
});

let incomeDetails = null;
let estimatedSavings = null;
let expenseDetails = null;
let showDate;
let source;

class DashBoard extends Component{
    constructor(props){
		super(props);

		this.state={
			isLoggedIn: false,
			showIncomeModal: false,
			showSavingsModal: false,
			showExpenseModal: false,
			showSnack: false,
			showSuccessSnack: false,
			loading: true,
			income: [],
			expenses: [],
			estimatedSavings: [],
			account: 'All Accounts'
		};

		source = axios.CancelToken.source();
    }

    async componentDidMount(){
		const [
			incomeData, 
			expenseData, 
			estimatedSavingsData
		] = await axios.all([
			axios.post(
				incomeDialogGet, 
				{
					email : this.props.location.state.email,
					type : 'Income'
				},
				{
					cancelToken: source.token
				}
			).catch((e) => {
				console.log(e);
			}), 
			axios.post(
				expenseDialogGet,
				{
					email : this.props.location.state.email, 
					type : 'Expense'
				},
				{
					cancelToken: source.token
				}
			).catch((e) => {
				console.log(e);
			}), 
			axios.post(
				estimatedSavingsDialogGet, 
				{
					email : this.props.location.state.email, 
					type : 'Target Savings'
				},
				{
					cancelToken: source.token
				}
			).catch((e) => {
				console.log(e);
			})
		])

		if(incomeData !== undefined && expenseData !== undefined && estimatedSavingsData !== undefined){
			this.setState({
				loading: false,
				isLoggedIn: this.props.location.state.email ? true : false,
				income: incomeData.data.income,
				expenses: expenseData.data.expenses,
				estimatedSavings: estimatedSavingsData.data.estimatedSavings
			})
		}
    }

    handleIncomeCallback = (incomeObject) => {				//for adding the details to the income array
		incomeDetails = incomeObject;
		showDate = incomeDetails ? incomeDetails.date : null;
	
		incomeDetails ? 
		this.setState({
			showIncomeModal: false,
			showSuccessSnack: true,
			income: [...this.state.income, incomeDetails]
		}) : this.setState({showIncomeModal: false}) 
    }

    handleEstimatedSavingsCallback = (savingsObject) => {	//for adding the details to the estimated savings array
		estimatedSavings = savingsObject;
		estimatedSavings ? 
		this.setState({
			showSavingsModal: false,
			estimatedSavings: [...this.state.estimatedSavings, estimatedSavings]
		}) : this.setState({showSavingsModal: false})
    }    

    handleExpenseCallback = (expenseObject) => {			//for adding the details to the expense array
		expenseDetails = expenseObject;
		showDate = expenseDetails ? expenseDetails.date : null;

		expenseDetails ? 
		this.setState({
			showExpenseModal: false,
			showSuccessSnack: true,
			expenses: [...this.state.expenses, expenseDetails]
		}) : this.setState({showExpenseModal: false})
    }

    handleIncomeClick = () => {			//for showing the income dialog
		this.setState({
			showIncomeModal: true
		});

		// axios.post(sendEmail,{
		// 	email: this.props.location.state.email,
		// 	transaction: getData(this.state.income, this.state.expenses, new Date())
		// }).then( res => {
		// 	console.log(res.data)
		// })
    }

    handleSavingsClick = () => {				//for showing the target savings dialog
		const income = this.state.income
						.reduce((accumulator, currentValue) => {
							return (accumulator += currentValue ? parseInt(currentValue.amount) : 0)
						}, 0) 

		if(income > 0) {
			this.setState({
				showSavingsModal: true
			});
		} 
		else {
			this.setState({
				showSnack: true
			});
		}
    }

    handleExpenseClick = () => {				//for showing the expense dialog
		this.setState({
			showExpenseModal: true
		});
    }

	handleFilterArray = (filterArray) => {		//for updating the dough nut chart corresponding to change in the table
		let income = [];
		let expenses = [];

		for(let i = 0; i < filterArray.length; i++) {
			if(filterArray[i].type === 'Income')
				income.push(filterArray[i]);
			else
				expenses.push(filterArray[i])
		}
		this.setState({
			income: income,
			expenses: expenses
		})
	}

    handleSnackClose = (event, reason) => {			//for closing the snackbar
		if (reason === "clickaway") {
         	  return;
        }
	
		this.setState({
			showSnack: false
		});
    }

	handleSuccessSnackOpen = () => {
		this.setState({
			showSuccessSnack: false
		})
	}
  
    handleLogout= () => {
		this.setState({
			isLoggedIn: false
		});
		this.props.handleLogInStatus(false);
    }

	handleLogoutSuccess = (res) => {
        this.setState({
            isLoggedIn: false
        }, () => {
			this.props.handleLogInStatus(false);
		});
    }

	handleFilterArrayByType = (type) => {
		this.setState({
			account: type
		})
		// if(type !== "All Accounts"){
		// 	let income = [];
		// 	let expenses = [];
			
		// 	let transactionArray = filterArrayByType(incomeExpenseArrayFx(this.state.income, this.state.expenses), type)
		// 	for(let i = 0; i < transactionArray.length; i++) {
		// 		if(transactionArray[i].type === 'Income')
		// 			income.push(transactionArray[i]);
		// 		else
		// 			expenses.push(transactionArray[i])
		// 	}
		// 	this.setState({
		// 		income: income,
		// 		expenses: expenses
		// 	})
		// }
		// else{
			
		// }
	}

    render() {
		const { classes } = this.props;
		const { 
			isLoggedIn, 
			showIncomeModal, 
			showSavingsModal, 
			showExpenseModal, 
			income, 
			expenses, 
			estimatedSavings 
		} = this.state;
		const { email, profilePhoto, googleSignIn } = this.props.location.state;

		let filteredIncome = income;
		let filteredExpenses = expenses;
		let filteredEstimatedSavings = estimatedSavings;

		if(this.state.account !== 'All Accounts'){
			filteredIncome = filterArrayByType(income, this.state.account);
			filteredExpenses = filterArrayByType(expenses, this.state.account);
			filteredEstimatedSavings = filterArrayByType(estimatedSavings, this.state.account)
		}

		return (
			<div className={classes.root} >
				<Notifier open={this.state.showSuccessSnack} setOpen={this.handleSuccessSnackOpen} message="Successfully Saved"  />
				
				<Drawer 
					info={this.props.location.state} 
					highlighted={0}
					isLoggedIn={isLoggedIn} 
					handleLogout={this.handleLogout}
					handleLogoutSuccess={this.handleLogoutSuccess} 
				/>
				{
					this.state.loading ? (
					<div className={classes.circularProgressContainer}> 
						<CircularProgress style={{alignSelf: 'center'}} /> 
					</div>) : (
					<main className={classes.content}>
						<div className={classes.toolbar} />
						<div>
						<h1 style={{marginTop: 0}}>Overview</h1>
						<div className={cssstyles.container}>
							<Filters account={this.state.account} handleFilterArrayByType={this.handleFilterArrayByType} />
							<div className={cssstyles.buttons}>
								<Button variant="contained" className={classes.containedGreen} startIcon={<AddIcon />} onClick={this.handleIncomeClick} >Add Income</Button>		  
								<Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={this.handleSavingsClick} >Add Target Savings</Button>
								<Button variant="contained" className={classes.containedRed} startIcon={<AddIcon />} onClick={this.handleExpenseClick} >Add Expense</Button>
							</div>
						</div>
			
						<CardCollection 
							income={filteredIncome}  
							expenses={filteredExpenses} 
							estimatedSavings={filteredEstimatedSavings} 
						/>		  
						
						<FilterTable
							income={filteredIncome} 
							expenses={filteredExpenses}
							showDate={showDate}
							handleFilterArray={this.handleFilterArray}
						/>
						{
							showIncomeModal ? 
							<IncomeDialog 
								modalStatus={showIncomeModal} 
								parentCallback = {this.handleIncomeCallback} 
								email={email} 
							/> : 
							null
						}

						{
							showSavingsModal ? 
							<EstimatedSavingsDialog 
								modalStatus={showSavingsModal} 
								income={this.state.income} 
								parentCallback = {this.handleEstimatedSavingsCallback}
								email={email} 
							/> : 
							null
						}

						{
							showExpenseModal ? 
							<ExpenseDialog 
								modalStatus={showExpenseModal} 
								parentCallback = {this.handleExpenseCallback} 
								email={email} 
							/> : 
							null
						}
						{this.state.showSnack && 
							<div>
      							<Snackbar
      	  						  anchorOrigin={{
          						    vertical: 'bottom',
          						    horizontal: 'left',
        						  }}
        						  open={this.state.showSnack}
        						  autoHideDuration={5000}
        						  onClose={this.handleSnackClose}
        						  message="Not allowed! Please add income first"
      							/>
    						</div>
						}
					</div>  
					</main> )
				}
			</div>
		);
    }

	componentWillUnmount() {
		if (source) {
		  source.cancel("Dashboard Component got unmounted");
		}
	}
}

export default withStyles(styles)(DashBoard);