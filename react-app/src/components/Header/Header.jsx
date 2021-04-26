import React from "react";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "white",
    color: "black",
    alignItems: "flex-end",
  },
  btnContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  btn: {
    margin: "0 10px",
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.appBar}>
        <Toolbar>
          <div className={classes.btnContainer}>
            <Button color='inherit' className={classes.btn}>
              Home
            </Button>
            <Button color='inherit' className={classes.btn}>
              About
            </Button>
            <Button color='inherit' className={classes.btn}>
              Contact Us
            </Button>
            <Button color='inherit' className={classes.btn}>
              Login
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
