import React, { Component } from "react";
import { Grid, Card, CardHeader, CardContent } from "@material-ui/core";
import { Bar } from "react-chartjs-2";
import { MonthWiseData, filterArrayByYearFx, getMonthNames } from "./getData";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

class MonthlyData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date1: new Date().toUTCString(),
      date2: new Date().toUTCString(),
    };
  }

  handleDate1Change = (date) => {
    this.setState({
      date1: date ? date.toUTCString() : null,
    });
  };

  handleDate2Change = (date) => {
    this.setState({
      date2: date ? date.toUTCString() : null,
    });
  };

  render() {
    const filterIncomeArray = filterArrayByYearFx(this.props.income, this.state.date1);
    const filterExpenseArray = filterArrayByYearFx(this.props.expenses, this.state.date1);
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

    const income = MonthWiseData(filterIncomeArray);
    const expense = MonthWiseData(filterExpenseArray);
    const savings = [];
    console.log(income, expense);

    for (let i = 0; i < income.length; i++) {
      savings.push(income[i] - expense[i]);
    }

    const data1 = {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: income,
          backgroundColor: "hsl(120, 82%, 33%)",
          borderColor: "black",
          borderWidth: 1,
        },
        {
          label: "Expense",
          data: expense,
          backgroundColor: "red",
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    };

    const data2 = {
      labels: months,
      datasets: [
        {
          label: "Savings",
          data: savings,
          backgroundColor: "#ffbb39",
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Rs.",
              fontColor: "black",
              fontSize: 18,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Month",
              fontColor: "black",
              fontSize: 18,
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            if (label) {
              label += ": Rs. ";
            }
            label += tooltipItem.yLabel;
            return label;
          },
        },
      },
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card raised style={{ height: "100%" }}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  width: "90%",
                  margin: "0 auto",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin='dense'
                    views={["year"]}
                    name='date'
                    label='Year'
                    value={this.state.date1}
                    onChange={this.handleDate1Change}
                    inputVariant='outlined'
                    animateYearScrolling
                    disableFuture
                    style={{
                      width: "6em",
                    }}
                    autoOk
                  />
                </MuiPickersUtilsProvider>
              </div>

              <div style={{ width: "90%", height: "50vh", margin: "0 auto" }}>
                <Bar data={data1} options={options} />
              </div>

              {filterExpenseArray.length !== 0 ? (
                <div style={{ width: "90%", margin: "10px auto", textAlign: "center" }}>
                  <span style={{ fontWeight: "bolder" }}>Highest Expenses: </span>
                  <span>
                    Rs. {Math.max(...expense)} in{" "}
                    {getMonthNames(expense, Math.max(...expense)).map(
                      (val, i, arr) => ` ${val}${i !== arr.length - 1 ? ", " : "."}`
                    )}
                  </span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card raised>
            <CardHeader title='Savings' style={{ textAlign: "center" }} />
            <CardContent>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  width: "90%",
                  margin: "0 auto",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin='dense'
                    views={["year"]}
                    name='date'
                    label='Year'
                    value={this.state.date2}
                    onChange={this.handleDate2Change}
                    inputVariant='outlined'
                    animateYearScrolling
                    disableFuture
                    style={{
                      width: "6em",
                    }}
                    autoOk
                  />
                </MuiPickersUtilsProvider>
              </div> */}

              <div style={{ width: "90%", height: "50vh", margin: "0 auto" }}>
                <Bar data={data2} options={options} />
              </div>

              {savings.every((item) => item === 0) ? null : (
                <div style={{ width: "90%", margin: "10px auto", textAlign: "center" }}>
                  <span style={{ fontWeight: "bolder" }}>Highest Savings: </span>
                  <span>
                    Rs. {Math.max(...savings)} in{" "}
                    {getMonthNames(savings, Math.max(...savings)).map(
                      (val, i, arr) => ` ${val}${i !== arr.length - 1 ? ", " : "."}`
                    )}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default MonthlyData;
