import React, { Component } from "react";
import DisplayTable from "./DisplayTable";
import { Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { getData, incomeExpenseArrayFx } from "./getData";
import { incomeDialog } from "./apiurl.js";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "axios";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
import { CSVLink } from "react-csv";

let flag = false;

class FilterTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchItem: "",
      date: new Date().toGMTString(),
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.showDate !== state.date && flag === false) {
      return {
        date: props.showDate ? props.showDate : state.date,
        filterArray: getData(
          props.income,
          props.expenses,
          props.showDate ? props.showDate : state.date
        ),
      };
    }
    return null;
  }

  handleDateChange = (date) => {
    flag = true;

    this.setState(
      {
        date: date ? date.toGMTString() : new Date().toGMTString(),
        filterArray: getData(
          this.props.income,
          this.props.expenses,
          date ? date.toGMTString() : new Date().toGMTString()
        ),
      },
      () => {
        flag = false;
      }
    );
  };

  handleSearchItemChange = (e) => {
    this.setState({
      searchItem: e.target.value,
    });
  };

  handleFilterArrayChange = (row) => {
    const index = incomeExpenseArrayFx(this.props.income, this.props.expenses).findIndex(
      (obj) => obj.type === row.type && obj.date === row.date
    );
    const array = incomeExpenseArrayFx(this.props.income, this.props.expenses);
    array.splice(index, 1);
    console.log("Array after deleting the income_expense: ", array);

    axios.delete(incomeDialog, { data: { type: row.type, date: row.date } }).then((data) => {
      console.log(data.data);
    });

    this.props.handleFilterArray(array);
  };

  render() {
    let filteredArray = getData(this.props.income, this.props.expenses, this.state.date).filter(
      (val) => {
        if (this.state.searchItem === "") {
          return val;
        } else if (val.type.toLowerCase().includes(this.state.searchItem.toLowerCase())) {
          return val;
        }
      }
    );
    const incomeExpenseArray = filteredArray.map((obj) => {
      return {
        type: obj.type,
        date: obj.date.substr(0, 16),
        amount: "Rs. " + +obj.amount,
        category: obj.category,
        description: obj.description,
        account: obj.account,
      };
    });

    const headers = [
      { label: "Type", key: "type" },
      { label: "Date", key: "date" },
      { label: "Amount", key: "amount" },
      { label: "Category", key: "category" },
      { label: "Description", key: "description" },
      { label: "Type of Account", key: "account" },
    ];

    const csvReport = {
      filename: "Income_Expense_Report.csv",
      headers: headers,
      data: incomeExpenseArray,
    };

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap-reverse",
            margin: "10px 0",
          }}
        >
          <div style={{ display: "flex", margin: "10px 0" }}>
            <div style={{ color: "white", backgroundColor: "black", padding: "5px" }}>
              <Tooltip title='Search'>
                <SearchIcon />
              </Tooltip>
            </div>
            <input
              placeholder='Search By Type'
              type='search'
              variant='outlined'
              value={this.state.searchItem}
              onChange={this.handleSearchItemChange}
              style={{ width: "10em", padding: "5px", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
            <Tooltip title='Filter'>
              <FilterListOutlinedIcon style={{ marginRight: "10px" }} />
            </Tooltip>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                margin='dense'
                views={["year", "month"]}
                name='date'
                label='Year and Month'
                value={this.state.date}
                onChange={this.handleDateChange}
                inputVariant='outlined'
                animateYearScrolling
                disableFuture
                openTo='month'
                autoOk
                style={{
                  width: "10em",
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <DisplayTable
          incomeExpense={filteredArray}
          showDate={this.state.date}
          handleFilterArrayChange={this.handleFilterArrayChange}
        />
        {incomeExpenseArray.length !== 0 && (
          <CSVLink
            {...csvReport}
            style={{
              backgroundColor: "#ffbb39",
              color: "white",
              padding: "14px 25px",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              marginTop: "15px",
            }}
          >
            Export
          </CSVLink>
        )}
      </>
    );
  }
}

export default FilterTable;
