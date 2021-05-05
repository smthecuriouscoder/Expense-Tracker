import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import styles from "./SignIn.module.css";

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {"Copyright © "}
      <Link to='/' style={{ textDecoration: "none" }}>
        Expense Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

let errors;

const emailRegex = RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

export default function SignIn() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    formErrors: {
      emailError: "",
      passwordError: "",
    },
  });

  const classes = useStyles();

  const handleChange = (e) => {
    errors = values.formErrors;

    if (e.target.name === "email") {
      errors.emailError = emailRegex.test(e.target.value)
        ? ""
        : "Please enter a valid email address";

      setValues({
        ...values,
        email: e.target.value,
        formErrors: {
          ...values.formErrors,
          emailError: errors.emailError,
        },
      });
    } else {
      errors.passwordError =
        e.target.value.length < 6 ? "Password length must be greater than 5 characters" : "";

      setValues({
        ...values,
        password: e.target.value,
        formErrors: {
          ...values.formErrors,
          passwordError: errors.passwordError,
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, formErrors } = values;
    errors = formErrors;

    if (email.length === 0) {
      errors.emailError = "Please fill out this field";
    }

    if (password.length === 0) {
      errors.passwordError = "Please fill out this field";
    }

    setValues({
      ...values,
      formErrors: {
        emailError: errors.emailError,
        passwordError: errors.passwordError,
      },
    });
  };

  const { email, password, formErrors } = values;
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            value={email}
            onChange={handleChange}
            error={formErrors.emailError ? true : false}
            helperText={formErrors.emailError}
            autoComplete='email'
            autoFocus
          />

          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            value={password}
            onChange={handleChange}
            error={formErrors.passwordError ? true : false}
            helperText={formErrors.passwordError}
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='#' className={styles.link}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to='/signup' className={styles.link}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
