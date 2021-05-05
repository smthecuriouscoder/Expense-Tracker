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
import styles from "../SignIn/SignIn.module.css";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

let errors;

const emailRegex = RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

export default function SignUp() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    formErrors: {
      nameError: "",
      emailError: "",
      passwordError: "",
    },
  });
  const classes = useStyles();

  const handleChange = (e) => {
    errors = values.formErrors;
    if (e.target.name === "fullName") {
      errors.nameError =
        e.target.value.length < 3 ? "Your name must contain atleast 3 characters" : "";

      setValues({
        ...values,
        name: e.target.value,
        formErrors: {
          ...values.formErrors,
          nameError: errors.nameError,
        },
      });
    } else if (e.target.name === "email") {
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
    const { name, email, password, formErrors } = values;
    errors = formErrors;

    if (name.length === 0) {
      errors.nameError = "Please fill out this field";
    }

    if (email.length === 0) {
      errors.emailError = "Please fill out this field";
    }

    if (password.length === 0) {
      errors.passwordError = "Please fill out this field";
    }

    setValues({
      ...values,
      formErrors: {
        nameError: errors.nameError,
        emailError: errors.emailError,
        passwordError: errors.passwordError,
      },
    });
  };

  const { name, email, password, formErrors } = values;
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete='fname'
                name='fullName'
                value={name}
                onChange={handleChange}
                error={formErrors.nameError ? true : false}
                helperText={formErrors.nameError}
                variant='outlined'
                required
                fullWidth
                id='fullName'
                label='Full Name'
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='outlined'
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
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='outlined'
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
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value='allowExtraEmails' color='primary' />}
                label='I want to receive monthly reports via email.'
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link to='/signin' className={styles.link}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
