import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "axios";
import { expenseDialog } from "./apiurl.js";
import { expenseCategories } from "../constants/categories";
import { PushToTalkButton, ErrorPanel } from "@speechly/react-ui";
import { useSpeechContext } from "@speechly/react-client";
import Notifier from "./Notifier";

let expenseObject = null;

const useStyles = makeStyles({
  dialog: {
    maxWidth: "330px",
  },
  divider: {
    margin: "5px 0",
  },
});

const ExpenseDialog = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    open: props.modalStatus,
    form: {
      type: "Expense",
      date: new Date().toUTCString(),
      amount: 0,
      category: "Other",
      description: "",
      account: "Personal",
    },
  });
  const [open, setOpen] = useState(false);
  const { segment } = useSpeechContext();

  useEffect(() => {
    //if the props change
    setState({
      open: props.modalStatus,
      form: {
        ...state.form,
      },
    });
  }, [props.modalStatus]);

  const mounted = useRef();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      if (segment) {
        if (segment.isFinal && segment.intent.intent === "create_transaction") {
          if (state.form.amount > 0) return handleSubmit();
          else alert("Please enter amount");
        } else if (segment.isFinal && segment.intent.intent === "cancel_transaction") {
          return handleClose();
        } else if (segment.isFinal && segment.intent.intent === "add_income") {
          setOpen(true);
          return;
        }

        segment.entities.forEach((s) => {
          const category = `${s.value.charAt(0)}${s.value.slice(1).toLowerCase()}`;
          const account = `${s.value.charAt(0)}${s.value.slice(1).toLowerCase()}`;

          switch (s.type) {
            case "amount":
              setState({
                ...state,
                form: {
                  ...state.form,
                  amount: s.value,
                },
              });
              break;
            case "category":
              if (expenseCategories.map((iC) => iC.type).includes(category)) {
                setState({
                  ...state,
                  form: {
                    ...state.form,
                    category,
                  },
                });
              }
              break;
            case "account":
              setState({
                ...state,
                form: {
                  ...state.form,
                  account,
                },
              });
              break;
            case "date":
              if (new Date(s.value) < new Date()) {
                setState({
                  ...state,
                  form: {
                    ...state.form,
                    date: new Date(s.value.toString()).toUTCString(),
                  },
                });
              }
              break;
            default:
              break;
          }
        });

        if (segment.isFinal && Number.isNaN(Number(state.form.amount))) {
          alert("Please speak valid amount.");
        } else if (segment.isFinal && state.form.amount && state.form.category && state.form.date) {
          handleSubmit();
        }
      }
    }
  }, [segment]);

  const handleClose = () => {
    setState({
      open: false,
      form: {
        ...state.form,
      },
    });
    if (segment !== undefined) {
      segment.words = [];
    }

    props.parentCallback(expenseObject);
    expenseObject = null;
  };

  const handleChange = (e) => {
    setState({
      ...state,
      form: {
        ...state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleDateChange = (dt) => {
    setState({
      ...state,
      form: {
        ...state.form,
        date: dt.toUTCString(),
      },
    });
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();

    axios
      .post(expenseDialog, {
        form: state.form,
        email: props.email,
      })
      .then((res) => {
        expenseObject = state.form;
        handleClose();
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && state.form.amount > 0) {
      handleSubmit();
    }
  };

  return (
    <div>
      <Notifier open={open} setOpen={setOpen} message='Please say expense' />
      <Dialog
        open={state.open}
        onClose={handleClose}
        classes={{ paper: classes.dialog }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Add an Expense</DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: "0 10px", textAlign: "center", lineHeight: "20px" }}>
            Try saying: <br />
            Add expense of Rs. 100 in category Fruits of Personal Account for today...
          </p>
          {segment && segment.words.length !== 0 && (
            <p
              style={{
                margin: "10px",
                padding: "5px",
                color: "white",
                backgroundColor: "black",
                fontWeight: "bold",
              }}
            >
              {segment && segment.words.map((w) => w.value).join(" ")}
            </p>
          )}
          <Divider className={classes.divider} />
          <form>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin='dense'
                name='date'
                label='Date'
                value={state.form.date}
                onChange={handleDateChange}
                format='dd/MM/yyyy'
                variant='inline'
                inputVariant='outlined'
                orientation='landscape'
                animateYearScrolling
                disableFuture
                autoOk
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <br />
            <TextField
              margin='dense'
              name='amount'
              label='Enter Amount...'
              type='number'
              value={state.form.amount}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              fullWidth
              variant='outlined'
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>Rs.</InputAdornment>,
              }}
              autoFocus
            />
            <br />
            <TextField
              fullWidth
              margin='dense'
              name='category'
              select
              label='Category'
              type='text'
              value={state.form.category}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              variant='outlined'
            >
              {expenseCategories.map((c) => (
                <MenuItem key={c.type} value={c.type}>
                  {c.type}
                </MenuItem>
              ))}
            </TextField>
            <br />
            <TextField
              margin='dense'
              name='description'
              label='Description'
              type='text'
              value={state.form.comments}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              variant='outlined'
              fullWidth
            />
            <br />
            <TextField
              select
              fullWidth
              margin='dense'
              name='account'
              label='Type of Account'
              type='text'
              value={state.form.account}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              variant='outlined'
            >
              <MenuItem value='Personal'>Personal</MenuItem>
              <MenuItem value='Business'>Business</MenuItem>
            </TextField>
          </form>
          <div style={{ position: "fixed", bottom: "10px", left: "47%" }}>
            <PushToTalkButton />
            <ErrorPanel />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={state.form.amount <= 0 ? true : false}
            color='primary'
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseDialog;
