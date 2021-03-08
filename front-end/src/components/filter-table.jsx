import React, { Component } from 'react';
import DisplayTable from './DisplayTable';
import { getData, incomeExpenseArrayFx } from './getData';
import { incomeDialog } from './apiurl.jsx';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from 'axios';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';

let flag = false;

class FilterTable extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            date: new Date().toGMTString()
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.showDate !== state.date && flag === false){
            return {
                date: props.showDate ? props.showDate : state.date,
                filterArray: getData(props.income, props.expenses, props.showDate ? 
                    props.showDate : 
                    state.date)
            }
        }
        return null;
    }
    
    // componentDidUpdate(prevProps) {
    //     // Typical usage (don't forget to compare props):
    //     if (this.props.showDate !== prevProps.showDate) {
    //       this.setState({
    //           date: this.props.showDate ? this.props.showDate : this.state.date,
    //           filterArray: getData(this.props.income, this.props.expenses, this.props.showDate ? this.props.showDate : this.state.date)
    //       })
    //     }
    //     console.log("ReRender")
    //   }

    handleDateChange = date => {
        flag = true;

        this.setState({
            date: date ? date.toGMTString() : new Date().toGMTString(),
            filterArray: getData(this.props.income, this.props.expenses, date ? date.toGMTString() : new Date().toGMTString())
        }, () => { 
            flag = false 
        })
    }

    handleFilterArrayChange = (row) => {
        const index = incomeExpenseArrayFx(this.props.income, this.props.expenses).findIndex( (obj) => (obj.type === row.type && obj.date === row.date) );
        const array = incomeExpenseArrayFx(this.props.income, this.props.expenses);
        array.splice(index,1);
        console.log("Array after deleting the income_expense: ",array);

        axios.delete(incomeDialog, {data: { type: row.type, date: row.date }}).then( data => {
            console.log(data.data);
        });

        this.props.handleFilterArray(array);
    }

    render() {
        console.log("State: ",this.state);
        console.log("Props: ",this.props);

        return (
            <>
                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline'}}>
                    <FilterListOutlinedIcon />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            margin="dense"
                            views={["year", "month"]}
                            name="date"
                            label="Year and Month"
                            value={this.state.date}
                            onChange={this.handleDateChange}
                            inputVariant="standard"
                            animateYearScrolling
                            disableFuture
                            openTo="year"
                            autoOk
                            style={{margin: '15px'}}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <DisplayTable 
                    incomeExpense={ getData(this.props.income, this.props.expenses, this.state.date)}
                    showDate={this.state.date}
                    handleFilterArrayChange={this.handleFilterArrayChange}
                />
            </>
        )
    }
}

export default FilterTable;
