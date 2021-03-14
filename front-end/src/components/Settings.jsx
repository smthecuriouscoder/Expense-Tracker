import React, { Component } from 'react';
import Drawer from './Drawer';
import Notifications from './Notifications';
import Password from './Password';
import UpdateDetails from './UpdateDetails';
import {
  Box,
  Container,
  IconButton,
  Snackbar
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
  },
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