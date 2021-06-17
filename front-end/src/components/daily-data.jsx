import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { incomeExpenseArrayFx, filterArrayFx } from "./getData";

//for the data of line chart in the analysis section
class DailyData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date().toUTCString(),
    };
  }

  handleDateChange = (date) => {
    this.setState({
      date: date ? date.toUTCString() : null,
    });
  };

  render() {
    const filterIncomeArray = filterArrayFx(
      incomeExpenseArrayFx(this.props.income, []),
      this.state.date
    );
    const filterExpenseArray = filterArrayFx(
      incomeExpenseArrayFx([], this.props.expenses),
      this.state.date
    );

    const noOfDays = new Date(
      Number(this.state.date.substr(12, 4)),
      new Date(this.state.date).getMonth() + 1,
      0
    ).getDate();

    const labels = []; //contains the no. of days of a month

    for (let i = 1; i <= noOfDays; i++) {
      if (new Date(this.state.date).getFullYear() === new Date().getFullYear()) {
        if (new Date(this.state.date).getMonth() < new Date().getMonth()) labels.push(i);
        else if (
          new Date(this.state.date).getMonth() === new Date().getMonth() &&
          i <= new Date().getDate()
        )
          labels.push(i);
      } else {
        labels.push(i);
      }
    }

    let incomeDataArray = [];
    let expenseDataArray = [];

    if (filterIncomeArray.length !== 0) {
      incomeDataArray.push({
        amount: +filterIncomeArray[0].amount,
        date: new Date(filterIncomeArray[0].date).getDate(),
      }); //for collecting data for unique dates

      for (let i = 1; i < filterIncomeArray.length; i++) {
        if (
          new Date(filterIncomeArray[i].date).getDate() ===
          new Date(filterIncomeArray[i - 1].date).getDate()
        ) {
          let e = incomeDataArray.pop();
          incomeDataArray.push({
            amount: +e.amount + +filterIncomeArray[i].amount,
            date: new Date(filterIncomeArray[i].date).getDate(),
          });
        } else {
          incomeDataArray.push({
            amount: +filterIncomeArray[i].amount,
            date: new Date(filterIncomeArray[i].date).getDate(),
          });
        }
      }
    }

    if (filterExpenseArray.length !== 0) {
      expenseDataArray.push({
        amount: +filterExpenseArray[0].amount,
        date: new Date(filterExpenseArray[0].date).getDate(),
      }); //for collecting data for unique dates

      for (let i = 1; i < filterExpenseArray.length; i++) {
        if (
          new Date(filterExpenseArray[i].date).getDate() ===
          new Date(filterExpenseArray[i - 1].date).getDate()
        ) {
          let e = expenseDataArray.pop();
          expenseDataArray.push({
            amount: +e.amount + +filterExpenseArray[i].amount,
            date: new Date(filterExpenseArray[i].date).getDate(),
          });
        } else {
          expenseDataArray.push({
            amount: +filterExpenseArray[i].amount,
            date: new Date(filterExpenseArray[i].date).getDate(),
          });
        }
      }
    }

    let chartIncomeArray = [];

    for (let i = 1; i <= noOfDays; i++) {
      const amount = incomeDataArray.find((income) => income.date === i);
      if (amount) {
        chartIncomeArray.push(amount.amount);
      } else {
        chartIncomeArray.push(0);
      }
    }

    let chartExpenseArray = [];

    for (let i = 1; i <= noOfDays; i++) {
      const amount = expenseDataArray.find((expense) => expense.date === i);
      if (amount) {
        chartExpenseArray.push(amount.amount);
      } else {
        chartExpenseArray.push(0);
      }
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Income",
          data: chartIncomeArray,
          backgroundColor: "#B7F69A",
          fill: true,
          borderColor: "green",
        },
        {
          label: "Expense",
          data: chartExpenseArray,
          fill: true,
          backgroundColor: "#E58090",
          borderColor: "red",
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
              labelString: "Date",
              fontColor: "black",
              fontSize: 18,
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return tooltipItem[0].xLabel + " " + this.state.date.substr(8, 8);
          },
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

    const monthNames = [
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

    return (
      <div style={{ margin: "20px 0" }}>
        <Card
          raised
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardHeader
            title={`Daily Record of ${monthNames[new Date(this.state.date).getMonth()]}`}
            style={{ textAlign: "center" }}
          />
          <CardContent style={{ alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
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
                  style={{
                    width: "10em",
                  }}
                  autoOk
                />
              </MuiPickersUtilsProvider>
            </div>
            <div style={{ width: "90%", height: "50vh", margin: "0 auto" }}>
              <Line data={data} options={options} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default DailyData;
