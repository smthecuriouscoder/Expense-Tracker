import React, {Component} from 'react';
import { Button, TextField, Snackbar } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, InputAdornment } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios';
import { estimatedSavingsDialog } from './apiurl.jsx';
import { filterArrayByType } from './getData.js';

let savingsObject = null;

class EstimatedSavingsDialog extends Component {
  constructor(props){
    super(props);

    this.state={
      open: props.modalStatus,
      alertOpen: false,
      form: {
	      date: new Date().toGMTString(),
    	  amount: 0,
    	  account: 'Personal'
      }
    };
  }

  handleAlert = () => {     //for showing the snackbar to restrict entering target savings amount greater than income
    this.setState({ 
      alertOpen: true 
    });    
  };

  handleAlertClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({ 
        alertOpen: false 
      });    
  };


  handleClose = () => {
    this.setState({
      open: false
    }, () => {
	    this.props.parentCallback(savingsObject);
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

    if(+this.state.form.amount 
        < 
        filterArrayByType(
          this.props.income,
          this.state.form.account
        ).reduce((accumulator, currentValue) => {
            return (accumulator += currentValue ? parseInt(currentValue.amount) : 0)
        }, 0)
    ) {
      axios.post(estimatedSavingsDialog,{form: this.state.form, email: this.props.email }).then( res => {
        console.log(res.data);
        savingsObject = this.state.form;
        this.handleClose();
      })
    }
    else {
	    this.handleAlert();
    }
  }

  handleKeyPress = e => {
    if(e.key === "Enter"){
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Target Savings</DialogTitle>
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
                label="Enter Savings Amount..."
                type="number"
		            fullWidth
                value={this.state.form.amount}
                onChange={this.handleChange}
		            onKeyPress={this.handleKeyPress}
	  	          inputProps={{min: 0}}
		            InputProps={{
            		  startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                }}
                variant="outlined"
                autoFocus
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
        <Snackbar 
              message="You cannot enter your estimated savings greater than your income" 
              open={this.state.alertOpen} 
              autoHideDuration={5000} 
              anchorOrigin={{horizontal: 'center',vertical: 'top'}} 
              onClose={this.handleAlertClose}
        />
      </div>
    );
  }
}

export default EstimatedSavingsDialog;