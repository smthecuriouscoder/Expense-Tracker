import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
  colors,
} from "@material-ui/core";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.orange[600],
  },
}));

const SavingsProgress = ({ className, totalEstimatedSavings, Balance, status, ...rest }) => {
  const classes = useStyles();
  let percentofSavings;
  let savingsAmount = totalEstimatedSavings;

  if (Balance >= savingsAmount) {
    percentofSavings = 100;
  } else if (Balance < savingsAmount) {
    percentofSavings = 0;
  } else {
    percentofSavings = (Balance / totalEstimatedSavings) * 100;
  }
  return (
    <Card raised style={status} className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify='space-between' spacing={3} wrap='nowrap'>
          <Grid item>
            <Typography color='textSecondary' gutterBottom variant='h6'>
              Your Target Savings:
            </Typography>
            <Typography color='textPrimary' variant='h5' style={{ color: "white" }}>
              Rs. {totalEstimatedSavings} {/*({targetPercentage} %)*/}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AccountBalanceIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={1}>
          <Typography color='textSecondary' gutterBottom variant='h6'>
            You Saved:
          </Typography>
          <Typography color='textPrimary' variant='h5' style={{ color: "white" }}>
            Rs. {Balance}
          </Typography>
        </Box>
        <Box mt={3}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={10}>
              <LinearProgress value={percentofSavings} variant='determinate' />
            </Grid>
            <Grid item xs={1}>
              <Typography color='textPrimary' variant='h6' style={{ color: "white" }}>
                {Math.round(percentofSavings)}%
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

SavingsProgress.propTypes = {
  className: PropTypes.string,
};

export default SavingsProgress;
