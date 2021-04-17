import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Switch,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import { updateSettings } from "./apiurl.js";

const useStyles = makeStyles({
  root: {},
  item: {
    display: "flex",
    flexDirection: "column",
  },
});

const Notifications = ({ className, email, setAlert, ...rest }) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedEmail: false,
    checkedReport: true,
  });

  //acts as ComponentDidMount
  useEffect(() => {
    axios.get(`${updateSettings}/${email}`).then(
      (response) => {
        setState({
          checkedEmail: response.data.request.isEmailChecked,
          checkedReport: response.data.request.isReportChecked,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(updateSettings, {
        email: email,
        isEmailChecked: state.checkedEmail,
        isReportChecked: state.checkedReport,
      })
      .then(
        (response) => {
          setAlert("Saved Successfully");
        },
        (error) => {
          console.log(error);
          alert("Some Error Occurred");
        }
      );
  };

  return (
    <form className={clsx(classes.root, className)} {...rest} onSubmit={handleSubmit}>
      <Card raised elevation={5}>
        <CardHeader subheader='Manage the notifications' title='Notifications' />
        <Divider />
        <CardContent>
          <Grid container spacing={8} wrap='wrap'>
            <Grid className={classes.item} item md={7} sm={7} xs={12}>
              <Typography color='textPrimary' gutterBottom variant='h6'>
                Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.checkedEmail}
                    onChange={handleChange}
                    name='checkedEmail'
                  />
                }
                label='Email'
              />
              {/* <FormControlLabel
                control={(
                  <Checkbox checked={state.checkedNotify} onChange={handleChange} name="checkedNotify" />
                )}
                label="Push Notifications"
              /> */}
            </Grid>
            <Grid className={classes.item} item md={5} sm={6} xs={12}>
              <Typography color='textPrimary' gutterBottom variant='h6'>
                Report
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.checkedReport}
                    onChange={handleChange}
                    name='checkedReport'
                  />
                }
                label='Send Monthly Report'
              />
              {/*<FormControlLabel
                control={(
                  <Checkbox defaultChecked />
                )}
                label="Email"
              />*/}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display='flex' justifyContent='flex-end' p={2}>
          <Button type='submit' color='primary' variant='contained'>
            Save
          </Button>
        </Box>
      </Card>
    </form>
  );
};

Notifications.propTypes = {
  className: PropTypes.string,
};

export default Notifications;
