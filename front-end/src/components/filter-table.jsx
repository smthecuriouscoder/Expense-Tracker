import React, { Component } from "react";
import DisplayTable from "./DisplayTable";
import { Tooltip, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { getData, incomeExpenseArrayFx } from "./getData";
import { incomeDialog } from "./apiurl.jsx";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "axios";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";

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

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap-reverse",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title='Search'>
              <SearchIcon style={{ marginRight: "10px" }} />
            </Tooltip>
            <TextField
              margin='dense'
              label='Search By Type'
              type='search'
              variant='outlined'
              value={this.state.searchItem}
              onChange={this.handleSearchItemChange}
              style={{ width: "10em" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title='Filter'>
              <FilterListOutlinedIcon />
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
                  margin: "15px 0 15px 10px",
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
      </>
    );
  }
}

export default FilterTable;
