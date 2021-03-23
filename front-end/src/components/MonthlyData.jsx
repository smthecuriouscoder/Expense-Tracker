import React, { Component } from "react";
import { Grid, Card, CardContent } from "@material-ui/core";
import { Bar } from "react-chartjs-2";
import { MonthWiseData, filterArrayByYearFx } from "./getData";
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
    const filterExpenseArray = filterArrayByYearFx(this.props.expenses, this.state.date2);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const income = MonthWiseData(filterIncomeArray);
    const expense = MonthWiseData(filterExpenseArray);
    const savings = [];
    for (let i = 0; i < income.length; i++) {
      savings.push(income[i] - expense[i]);
    }

    const data1 = {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: MonthWiseData(filterIncomeArray),
          backgroundColor: "hsl(120, 82%, 33%)",
          borderColor: "black",
          borderWidth: 1,
        },
        {
          label: "Expense",
          data: MonthWiseData(filterExpenseArray),
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

    console.log(savings);
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
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card raised>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "90%",
                  margin: "0 auto",
                }}
              >
                <h2>Savings</h2>
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
              </div>

              <div style={{ width: "90%", height: "50vh", margin: "0 auto" }}>
                <Bar data={data2} options={options} />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default MonthlyData;
