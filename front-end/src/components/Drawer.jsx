import React, { Component } from "react";
import PopOver from "./Popover";
import {
  Avatar,
  Drawer as MUIDrawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Hidden,
  Badge,
  Tooltip,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import cssstyles from "../styles/Dashboard.module.css";
import NotificationDropDown from "./NotificationDropDown";

const drawerWidth = 190;

const styles = (theme) => ({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#086d08",
    },
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: "190px",
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: "hsl(120, 82%, 33%)",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    backgroundColor: "hsl(120, 82%, 33%)",
    width: "190px",
  },
  sideBarItems: {
    color: "white",
  },
  icon: {
    minWidth: "56px",
    color: "white",
  },
  customBadge: {
    backgroundColor: "red",
  },
});

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
      selectedIndex: 0,
      mobileOpen: false,
      pop_open: false,
      anchorEl: null,
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      selectedIndex: props.highlighted,
    };
  }

  //for toggling the drawer
  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  };

  //for opening the pop over
  handleClick = (event) => {
    this.setState({
      pop_open: true,
      anchorEl: event.currentTarget,
    });
  };

  //for closing the pop over
  handleClose = () => {
    this.setState({
      pop_open: false,
      anchorEl: null,
    });
  };

  handleDropDownToggle = () => {
    this.setState({
      hidden: !this.state.hidden,
    });
  };

  render() {
    const { history, classes } = this.props;
    const info = this.props.info;

    const itemsList = [
      {
        text: "Dashboard",
        icon: <DashboardOutlinedIcon />,
        selectedIndex: 0,
        onClick: () => {
          history.replace({
            pathname: "/dashboard",
            state: {
              name: info.name,
              email: info.email,
              profilePhoto: info.profilePhoto,
              googleSignIn: info.googleSignIn,
            },
          });
        },
      },
      {
        text: "Analysis",
        icon: <AssessmentOutlinedIcon />,
        selectedIndex: 1,
        onClick: () => {
          history.replace({
            pathname: "/analysis",
            state: {
              name: info.name,
              email: info.email,
              profilePhoto: info.profilePhoto,
              googleSignIn: info.googleSignIn,
            },
          });
        },
      },
      {
        text: "Settings",
        icon: <SettingsIcon />,
        selectedIndex: 2,
        onClick: () => {
          history.replace({
            pathname: "/settings",
            state: {
              name: info.name,
              email: info.email,
              profilePhoto: info.profilePhoto,
              googleSignIn: info.googleSignIn,
            },
          });
        },
      },
    ];

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {itemsList.map((item, index) => {
            const { text, icon, selectedIndex, onClick } = item;
            return (
              <ListItem
                button
                selected={this.state.selectedIndex === selectedIndex}
                className={classes.root}
                key={text}
                onClick={onClick}
              >
                <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                <ListItemText primary={text} className={classes.sideBarItems} />
              </ListItem>
            );
          })}
        </List>
      </div>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
      <>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h5' noWrap className={cssstyles.pageHeader}>
              Hello {info.name}
            </Typography>
            <Tooltip title='Notifications'>
              <IconButton
                style={{
                  color: "white",
                  marginRight: "5px",
                }}
                onClick={this.handleDropDownToggle}
              >
                <Badge
                  badgeContent={0}
                  classes={{
                    badge: classes.customBadge,
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {this.state.hidden ? null : <NotificationDropDown />}
            <IconButton onClick={this.handleClick}>
              <Avatar alt={info.email} src={info.profilePhoto} />
            </IconButton>

            <PopOver
              pop_open={this.state.pop_open}
              anchorEl={this.state.anchorEl}
              isLoggedIn={this.props.isLoggedIn}
              handleLogout={this.props.handleLogout}
              handleLogoutSuccess={this.props.handleLogoutSuccess}
              handleClose={this.handleClose}
              googleSignIn={info.googleSignIn}
            />
          </Toolbar>
        </AppBar>
        <div className={classes.drawer}>
          <Hidden smUp implementation='css'>
            <MUIDrawer
              container={container}
              variant='temporary'
              anchor='left'
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </MUIDrawer>
          </Hidden>

          <Hidden xsDown implementation='css'>
            <MUIDrawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant='permanent'
              open
            >
              {drawer}
            </MUIDrawer>
          </Hidden>
        </div>
      </>
    );
  }
}

export default compose(withRouter, withStyles(styles))(Drawer);
