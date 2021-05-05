import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, IconButton, Drawer } from "@material-ui/core";
import logo from "../../assets/money.png";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const headersData = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "#",
  },
  {
    label: "Contact Us",
    href: "#footer",
  },
  {
    label: "Sign In",
    href: "/signin",
  },
];

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "white",
    color: "black",
  },
  toolBar: {
    justifyContent: "space-between",
  },
  btnContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  btn: {
    margin: "0 10px",
  },
  drawerContainer: {
    padding: "20px 50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
  },
}));

export default function Header() {
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const classes = useStyles();
  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const appLogo = (
    <img src={logo} style={{ alignSelf: "center" }} alt='logo' width='60' height='65' />
  );

  const displayDesktop = () => {
    return (
      <Toolbar className={classes.toolBar}>
        {appLogo}
        <div className={classes.btnContainer}>
          {headersData.map(({ label, href }) => {
            return label === "Contact Us" ? (
              <Button
                {...{
                  key: label,
                  color: "inherit",
                  href: href,
                  className: classes.btn,
                }}
              >
                {label}
              </Button>
            ) : (
              <Button
                {...{
                  key: label,
                  color: "inherit",
                  to: href,
                  component: Link,
                  className: classes.btn,
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));
    const getDrawerChoices = () => {
      return headersData.map(({ label, href }) => {
        return label === "Contact Us" ? (
          <Button
            {...{
              key: label,
              color: "inherit",
              href: href,
              className: classes.btn,
              onClick: handleDrawerClose,
            }}
          >
            {label}
          </Button>
        ) : (
          <Button
            {...{
              key: label,
              color: "inherit",
              to: href,
              component: Link,
              className: classes.btn,
            }}
          >
            {label}
          </Button>
        );
      });
    };

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
          PaperProps={{
            className: styles.drawer,
          }}
        >
          {appLogo}
          <div className={classes.drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>
        <div>{appLogo}</div>
      </Toolbar>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.appBar}>
        {/*<Toolbar>
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
        </Toolbar> */}
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </div>
  );
}
