import React, {Component} from "react";
import {
  Drawer as MUIDrawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { compose } from 'redux';

const styles = theme => ({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#086d08"
    }
  },
  drawer: {
    width: "190px",
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: 'hsl(120, 82%, 33%)',
    width: "190px",
  },
  toolbar: theme.mixins.toolbar,
  sideBarItems: {
    color: 'white',
  },
  icon: {
    minWidth: '56px',
    color: 'white',
  },
});

class Drawer extends Component {
  constructor(props){
    super(props);

    this.state={
	    selectedIndex: 0
    }
  }

  static getDerivedStateFromProps(props) {    
    return {
      selectedIndex: props.highlighted
    }
  }

  render() {
    const { history, classes } = this.props;

    const itemsList = [
      {
        text: "Dashboard",
        icon: <DashboardOutlinedIcon />,
        selectedIndex: 0,
        onClick: () => {
            history.replace({
                          pathname: "/dashboard",
                          state: { email: this.props.info.email, profilePhoto: this.props.info.profilePhoto, googleSignIn: this.props.info.googleSignIn }
            })
          }
      },
      {
        text: "Analysis",
        icon: <AssessmentOutlinedIcon />,
        selectedIndex: 1,
        onClick: () => {	 	      
            history.replace({
                          pathname: "/analysis",
                          state: { email: this.props.info.email, profilePhoto: this.props.info.profilePhoto, googleSignIn: this.props.info.googleSignIn }
            })
          }
      },
      {
        text: "Settings",
        icon: <SettingsIcon />,
        selectedIndex: 2,
        onClick: () => {
            history.replace({
                          pathname: "/settings",
                          state: { email: this.props.info.email, profilePhoto: this.props.info.profilePhoto, googleSignIn: this.props.info.googleSignIn }
            })
          }
      }
    ];

    return (
      <MUIDrawer 
        variant="permanent" 
        className={classes.drawer}  
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {itemsList.map( (item, index) => {
            const { text, icon, selectedIndex, onClick } = item;
            return (
              <ListItem button selected={this.state.selectedIndex === selectedIndex} className={classes.root} key={text} onClick={onClick}>
                <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                <ListItemText primary={text} className={classes.sideBarItems} />
              </ListItem>
            );
          })}
        </List>
      </MUIDrawer>
    );
  }
}

export default compose( withRouter, withStyles(styles) )(Drawer);