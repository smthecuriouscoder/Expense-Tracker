import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getData } from './getData'; 

class DailyData extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       date: new Date().toUTCString()
    }
  }
  
  handleDateChange = date => {
    this.setState({
        date: date ? date.toUTCString() : null
    })
  }

  render() {
    // let rows = this.props.income
    //           .concat(this.props.expenses)
    //           .sort ( function (a, b){
    //             return new Date(a.date) - new Date(b.date);
    //           });

    // const filterArray = rows.filter( obj => {
    //   if(new Date(obj.date).getFullYear() === new Date(this.state.date).getFullYear()) {
    //       if(new Date(obj.date).getMonth() === new Date(this.state.date).getMonth()) {
    //         return obj;
    //       }
    //   }
    // });

    const filterArray = getData(this.props.income, this.props.expenses, this.state.date);

    const labels = filterArray.map(obj => new Date(obj.date).getDate());
    const uniqueSet = new Set(labels);
    const array = [...uniqueSet];         //for getting unique dates

    let incomeDataArray;
    let expenseDataArray

    if(filterArray.length !== 0){

      incomeDataArray = [filterArray[0].type === 'Income' ? filterArray[0].amount : 0];     //for collecting data for unique dates
      expenseDataArray = [filterArray[0].type === 'Expense' ? filterArray[0].amount : 0];
      
      for(let i=1;i<filterArray.length;i++) {
        if(filterArray[i].type === 'Income') {

          if(new Date(filterArray[i].date).getDate() === new Date(filterArray[i-1].date).getDate()) {
            incomeDataArray.pop();
            incomeDataArray.push(+filterArray[i-1].amount + +filterArray[i].amount);
        
          } else {
            incomeDataArray.push(filterArray[i].amount);
            expenseDataArray.push(0);
          }

        }
        else {
          
          if(new Date(filterArray[i].date).getDate() === new Date(filterArray[i-1].date).getDate()) {
            expenseDataArray.pop();
            expenseDataArray.push(+filterArray[i-1].amount + +filterArray[i].amount);
          } else {
            expenseDataArray.push(filterArray[i].amount);
            incomeDataArray.push(0);
          }
        }
      }
      
      console.log(`Income: ${incomeDataArray}`);
      console.log(`Expense:  ${expenseDataArray}`);
    }

    const data = {
      labels: array,
      datasets: [
        {
          label: 'Income',
          data: incomeDataArray,
          fill: false,
          backgroundColor: 'green',
          borderColor: 'green'
        },
        {
          label: 'Expense',
          data: expenseDataArray,
          fill: false,
          backgroundColor: 'red',
          borderColor: 'red'
        }
      ]
    }
  
    const options = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            type: 'linear',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Rs.',
              fontColor: 'black',
              fontSize: 18,
            }
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Date',
              fontColor: 'black',
              fontSize: 18
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return tooltipItem[0].xLabel + ' ' + this.state.date.substr(8,8);
          },
          label: (tooltipItem, data) => {
              var label = data.datasets[tooltipItem.datasetIndex].label;
              if (label) {
                  label += ': Rs. ';
              }
              label += tooltipItem.yLabel;
              return label;
          }
        }
      }
    }

    return(
      <div style={{marginTop: '20px'}}>
        <Card raised elevation={15} style={{
                              display: "flex",
                              flexDirection: "column"
                            }} >
        
          <CardContent style={{alignItems: 'center', width: '100%'}}>
            <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: 'wrap',
                    margin: "0 30px"
                }}
            > 
              <h2>Monthly Record</h2>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                      margin="dense"
                      views={["year", "month"]}
                      name="date"
                      label="Year and Month"
                      value={this.state.date}
                      onChange={this.handleDateChange}
                      inputVariant="outlined"
                      animateYearScrolling
                      disableFuture
                      openTo="year"
                      autoOk
                    />
              </MuiPickersUtilsProvider>
            </div>
            <div style={{width: "90%", height: '50vh', margin: '0 auto'}}>
              <Line data={data} options={options} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default DailyData;