import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import { updatePassword } from "./apiurl.js";

const useStyles = makeStyles({
  root: {},
});

let errors;

const formValid = (errors) => {
  let valid = true;

  Object.values(errors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  return valid;
};

const Password = ({ className, userDetails, email, setAlert, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    password: "",
    confirm: "",
    errors: {
      passwordError: "",
      confirmPasswordError: "",
    },
  });

  const handleChange = (event) => {
    const value = event.target.value;
    errors = values.errors;
    event.target.name === "password"
      ? (errors.passwordError =
          value.length < 6 ? "Password length must be greater than 5 characters" : "")
      : (errors.passwordError = "");

    event.target.name === "confirm"
      ? (errors.confirmPasswordError =
          value.length < 6 ? "Password length must be greater than 5 characters" : "")
      : (errors.confirmPasswordError = "");

    setValues({
      ...values,
      [event.target.name]: event.target.value,
      errors: {
        passwordError: errors.passwordError,
        confirmPasswordError: errors.confirmPasswordError,
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { password, confirm, errors } = values;

    if (password.length === 0) {
      errors.passwordError = "Please fill out this field";
    }

    if (confirm.length === 0) {
      errors.confirmPasswordError = "Please fill out this field";
    }

    setValues({
      ...values,
      errors: {
        passwordError: errors.passwordError,
        confirmPasswordError: errors.confirmPasswordError,
      },
    });

    if (formValid(errors)) {
      if (values.password === values.confirm) {
        const object = {
          email: email,
          password: values.password,
          confirm: values.confirm,
        };

        axios.post(updatePassword, object).then((data) => {
          console.log(data.data);
          setValues({
            ...values,
            password: "",
            confirm: "",
          });
          setAlert("Password Updated Successfully");
        });
      } else {
        alert("Password don't match");
      }
    }
  };

  const isDisabled = userDetails.googleId ? true : false;

  return (
    <form className={clsx(classes.root, className)} {...rest}>
      <Card raised elevation={5}>
        <CardHeader subheader='Update password' title='Password' />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label='New Password'
            margin='normal'
            name='password'
            onChange={handleChange}
            type='password'
            error={values.errors.passwordError ? true : false}
            helperText={values.errors.passwordError}
            value={values.password}
            variant='outlined'
          />
          <TextField
            fullWidth
            label='Confirm Password'
            margin='normal'
            name='confirm'
            error={values.errors.confirmPasswordError ? true : false}
            helperText={values.errors.confirmPasswordError}
            onChange={handleChange}
            type='password'
            value={values.confirm}
            variant='outlined'
          />
        </CardContent>
        <Divider />
        <Box display='flex' justifyContent='flex-end' p={2}>
          <Button disabled={isDisabled} color='primary' variant='contained' onClick={handleSubmit}>
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

Password.propTypes = {
  className: PropTypes.string,
};

export default Password;
