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
import { updateDetails } from "./apiurl.jsx";
import axios from "axios";

const useStyles = makeStyles({
  root: {},
});

const UpdateDetails = ({ className, userDetails, handleUpdateUserDetails, setAlert, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: userDetails.name || "",
    email: userDetails.email,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (values.name === "" || values.email === "") {
      alert("Please fill both the fields");
    } else {
      const object = {
        name: values.name,
        email: values.email,
      };
      axios.post(updateDetails, object).then((data) => {
        handleUpdateUserDetails({ email: values.email });
        setAlert("Details Updated Successfully");
      });
    }
  };

  return (
    <form className={clsx(classes.root, className)} {...rest}>
      <Card raised elevation={5}>
        <CardHeader subheader='Update personal details' title='Personal Details' />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label='Name'
            margin='normal'
            name='name'
            onChange={handleChange}
            type='text'
            value={values.name}
            variant='outlined'
          />
          <TextField
            fullWidth
            label='Email'
            margin='normal'
            name='email'
            onChange={handleChange}
            type='email'
            value={values.email}
            variant='outlined'
          />
        </CardContent>
        <Divider />
        <Box display='flex' justifyContent='flex-end' p={2}>
          <Button color='primary' variant='contained' onClick={handleSubmit}>
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

UpdateDetails.propTypes = {
  className: PropTypes.string,
};

export default UpdateDetails;
