import React from "react";
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

const useStyles = makeStyles({
  root: {},
  item: {
    display: "flex",
    flexDirection: "column",
  },
});

const Notifications = ({ className, setAlert, ...rest }) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedEmail: false,
    checkedNotify: true,
    checkedReport: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAlert("Saved Successfully");
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
