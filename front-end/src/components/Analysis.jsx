import React, { Component } from "react";
import spinner from "../assets/circles-menu-1.gif";
import Drawer from "./Drawer";
import Filters from "./Filters";
import MonthlyData from "./MonthlyData";
import DailyData from "./daily-data";
import axios from "axios";
import { incomeDialogGet, expenseDialogGet, estimatedSavingsDialogGet } from "./apiurl.js";
import { filterArrayByType } from "./getData.js";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(5),
  },
});

let source;

class Analysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      income: [],
      expenses: [],
      estimatedSavings: [],
      account: "All Accounts",
    };

    source = axios.CancelToken.source();
  }

  async componentDidMount() {
    const [incomeData, expenseData, estimatedSavingsData] = await axios.all([
      axios
        .post(
          incomeDialogGet,
          {
            email: this.props.location.state.email,
            type: "Income",
          },
          {
            cancelToken: source.token,
          }
        )
        .catch((e) => {
          console.log(e);
        }),
      axios
        .post(
          expenseDialogGet,
          {
            email: this.props.location.state.email,
            type: "Expense",
          },
          {
            cancelToken: source.token,
          }
        )
        .catch((e) => {
          console.log(e);
        }),
      axios
        .post(
          estimatedSavingsDialogGet,
          {
            email: this.props.location.state.email,
            type: "Target Savings",
          },
          {
            cancelToken: source.token,
          }
        )
        .catch((e) => {
          console.log(e);
        }),
    ]);

    if (
      incomeData !== undefined &&
      expenseData !== undefined &&
      estimatedSavingsData !== undefined
    ) {
      this.setState({
        income: incomeData.data.income,
        expenses: expenseData.data.expenses,
        estimatedSavings: estimatedSavingsData.data.estimatedSavings,
        loading: false,
      });
    }
  }

  handleFilterArrayByType = (type) => {
    //for changing the account type (All Accounts or Personal or Business)
    this.setState({
      account: type,
    });
  };

  handleLogout = () => {
    this.props.handleLogInStatus(false);
  };

  handleLogoutSuccess = (res) => {
    this.props.handleLogInStatus(false);
  };

  render() {
    const { classes, userDetails } = this.props;
    const { income, expenses } = this.state;

    let filteredIncome = income;
    let filteredExpenses = expenses;
    //let filteredEstimatedSavings = estimatedSavings;

    if (this.state.account !== "All Accounts") {
      filteredIncome = filterArrayByType(income, this.state.account);
      filteredExpenses = filterArrayByType(expenses, this.state.account);
      //  filteredEstimatedSavings = filterArrayByType(estimatedSavings, this.state.account);
    }

    return (
      <div className={classes.root}>
        <Drawer
          info={{
            email: userDetails.email,
            profilePhoto: userDetails.imageUrl,
            googleSignIn: userDetails.googleId ? true : false,
          }}
          highlighted={1}
          isLoggedIn={this.props.isSignedIn}
          handleLogout={this.handleLogout}
          handleLogoutSuccess={this.handleLogoutSuccess}
        />
        {this.state.loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "100vh",
              width: "100%",
            }}
          >
            <img src={spinner} alt='spinner' style={{ width: "100px", alignSelf: "center" }} />
          </div>
        ) : (
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Filters
              account={this.state.account}
              handleFilterArrayByType={this.handleFilterArrayByType}
            />
            <MonthlyData income={filteredIncome} expenses={filteredExpenses} />
            <DailyData income={filteredIncome} expenses={filteredExpenses} />
          </main>
        )}
      </div>
    );
  }

  componentWillUnmount() {
    if (source) {
      source.cancel("Analysis Component got unmounted");
    }
  }
}

export default withStyles(styles)(Analysis);
