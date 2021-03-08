import React, { Component } from 'react';
import { Typography, AppBar, Toolbar, Snackbar } from '@material-ui/core';
import Drawer from './Drawer';
import cssstyles from '../styles/Analysis.module.css';
import { withStyles } from '@material-ui/core/styles';
import {
  Box,
  Container,
  IconButton
} from '@material-ui/core';
import Notifications from './Notifications';
import Password from './Password';
import UpdateDetails from './UpdateDetails';
import CloseIcon from '@material-ui/icons/Close';

const drawerWidth = 190;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: 'hsl(120, 82%, 33%)'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(5),
  }
});


class Settings extends Component{
    constructor(props){
		super(props);

		this.state={
			alertOpen: false,
			alertMessage: ''
		}
    }

    handleAlert = (message) => {
      this.setState({ alertOpen: true, alertMessage: message });    
    };

    handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      this.setState({ alertOpen: false });    
    };

    render() {
        const { classes } = this.props;

        return (
          <div className={classes.root}>
	        <AppBar position="fixed" className={classes.appBar}>
        	    <Toolbar>
        	      <Typography variant="h5" noWrap className={cssstyles.analysisHeading}>Settings</Typography>
        	    </Toolbar>
        	</AppBar>
		  	<Drawer info={this.props.location.state} highlighted={2} />
		  	<main className={classes.content}>
		        <div className={classes.toolbar} />
		        <Container maxWidth="lg">
        			<Notifications setAlert={this.handleAlert} />
			  		<Box mt={3}>
			    		<UpdateDetails userDetails={this.props.userDetails} />
			  		</Box>

			   		<Box mt={3}>
          		    	<Password email={this.props.location.state.email} setAlert={this.handleAlert} />
        		  	</Box>
      			</Container>
				<Snackbar 
					message={this.state.alertMessage}
					open={this.state.alertOpen} 
					autoHideDuration={4000} 
					anchorOrigin={{horizontal: 'center',vertical: 'top'}} 
					onClose={this.handleClose}
					action={
							<React.Fragment>
								<IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
									<CloseIcon fontSize="small" />
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