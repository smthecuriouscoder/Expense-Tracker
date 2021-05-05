import React from "react";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withWidth,
} from "@material-ui/core";
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import money from "../../assets/undraw_wallet_aym5.svg";
import styles from "./Body.module.css";
import { withRouter } from "react-router-dom";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

function Body({ width, ...rest }) {
  const isSmallScreen = /xs|sm/.test(width);
  const buttonProps = {
    size: isSmallScreen ? "medium" : "large",
  };

  const handleClick = () => {
    rest.history.push("/signin");
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.title}>
        <ThemeProvider theme={theme}>
          <Typography variant='h2' gutterBottom className={styles.heading}>
            Expense Tracker
          </Typography>
        </ThemeProvider>

        <List className={styles.featuresList}>
          <ListItem>
            <ListItemIcon>
              <CheckIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText>Track your daily expenses and be a money saver</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText>See your income and expenses in tables and graphs</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText>Get monthly report of income and expenses</ListItemText>
          </ListItem>
        </List>

        <Button variant='contained' color='primary' onClick={handleClick} {...buttonProps}>
          Get Started
        </Button>
      </div>
      <div className={styles.imgContainer}>
        <img src={money} alt='money' width='500' height='500' className={styles.walletImage} />
      </div>
    </div>
  );
}

export default withRouter(withWidth()(Body));
