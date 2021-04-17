import React, { Component } from "react";
import Drawer from "./Drawer";
import Notifications from "./Notifications";
import Password from "./Password";
import UpdateDetails from "./UpdateDetails";
import { Box, Container, IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(5),
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alertOpen: false,
      alertMessage: "",
    };
  }

  //for opening the snackbar
  handleSnackOpen = (message) => {
    this.setState({ alertOpen: true, alertMessage: message });
  };

  //for closing the snackbar
  handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ alertOpen: false });
  };

  handleLogout = () => {
    this.props.handleLogInStatus(false);
  };

  handleLogoutSuccess = (res) => {
    this.props.handleLogInStatus(false);
  };

  render() {
    const { classes, userDetails } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          info={{
            name: userDetails.name,
            email: userDetails.email,
            profilePhoto: userDetails.imageUrl,
            googleSignIn: userDetails.googleId ? true : false,
          }}
          highlighted={2}
          isLoggedIn={this.props.isSignedIn}
          handleLogout={this.handleLogout}
          handleLogoutSuccess={this.handleLogoutSuccess}
        />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Container maxWidth='lg'>
            <Notifications email={this.props.userDetails.email} setAlert={this.handleSnackOpen} />
            <Box mt={3}>
              <UpdateDetails
                userDetails={this.props.userDetails}
                handleUpdateUserDetails={this.props.handleUpdateUserDetails}
                setAlert={this.handleSnackOpen}
              />
            </Box>

            <Box mt={3}>
              <Password
                userDetails={this.props.userDetails}
                email={this.props.location.state.email}
                setAlert={this.handleSnackOpen}
              />
            </Box>
          </Container>
          <Snackbar
            message={this.state.alertMessage}
            open={this.state.alertOpen}
            autoHideDuration={3000}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
            onClose={this.handleSnackClose}
            action={
              <React.Fragment>
                <IconButton
                  size='small'
                  aria-label='close'
                  color='inherit'
                  onClick={this.handleSnackClose}
                >
                  <CloseIcon fontSize='small' />
                </IconButton>
              </React.Fragment>
            }
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
