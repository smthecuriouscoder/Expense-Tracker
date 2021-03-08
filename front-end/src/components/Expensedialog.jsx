import React, {Component} from 'react';
import { Button, TextField } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, InputAdornment } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from 'axios';
import { expenseDialog } from './apiurl.jsx'

let expenseObject = null;

class ExpenseDialog extends Component {
  constructor(props){
    super(props);

    this.state={
      open: props.modalStatus,
      form: {
	      type: 'Expense',
        date: new Date().toGMTString(),
        amount: 0,
        category: 'Others',
        description: '',
        account: 'Personal'
      }
    };
  }

  handleClose = () => {
    this.setState({
	    open: false
    }, () => {
        this.props.parentCallback(expenseObject);
        expenseObject=null;
    });
  }

  handleChange = e => {
    this.setState({
      ...this.state,
      form: {
	      ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  }

  handleDateChange = date => {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        date: date.toGMTString()
      }
    })
  }

  handleSubmit = e => {
    if(e){
	    e.preventDefault();
    }
    
    axios.post(expenseDialog, { form: this.state.form, email: this.props.email}).then( res => {
      console.log(res.data);
      expenseObject = this.state.form;
      this.handleClose();
    })
  }

  handleKeyPress = e => {
    if(e.key === "Enter" && this.state.form.amount>0){
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add an Expense</DialogTitle>
          <DialogContent dividers>
            <form>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    margin="dense"
                    name="date"
                    label="Date"
                    value={this.state.form.date}
                    onChange={this.handleDateChange}
                    format="dd/MM/yyyy"
                    variant="inline"
                    inputVariant="outlined"
                    orientation="landscape"
                    animateYearScrolling
                    disableFuture
                    autoOk
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
              <br />
              <TextField
                  margin="dense"
                  name="amount"
                  label="Enter Amount..."
                  type="number"
                  value={this.state.form.amount}
                  onChange={this.handleChange}
	                onKeyPress={this.handleKeyPress}
		              fullWidth
                  variant="outlined"
	                inputProps={{min: 0}}
		              InputProps={{
            		    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                  autoFocus
              />
              <br />
              <TextField
                  margin="dense"
                  name="category"
                  label="Category"
                  type="text"
                  value={this.state.form.category}
                  onChange={this.handleChange}
 	                onKeyPress={this.handleKeyPress}
                  variant="outlined"
		              fullWidth
              />
              <br />
              <TextField
                  margin="dense"
                  name="description"
                  label="Description"
                  type="text"
                  value={this.state.form.comments}
                  onChange={this.handleChange}
		              onKeyPress={this.handleKeyPress}
                  variant="outlined"
		              fullWidth
              />	  
              <br />
              <TextField
		              select
		              fullWidth
                  margin="dense"
                  name="account"
                  label="Type of Account"
                  type="text"
                  value={this.state.form.account}
                  onChange={this.handleChange}
	                onKeyPress={this.handleKeyPress}
                  variant="outlined"
              >
		            <MenuItem value='Personal'>Personal</MenuItem>
		            <MenuItem value='Business'>Business</MenuItem>
	            </TextField>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} disabled={this.state.form.amount <= 0 ? true : false} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
   );
  }
}

export default ExpenseDialog;
