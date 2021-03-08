import React, { Component } from 'react';
import PopOver from './Popover';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Typography, IconButton, Avatar, AppBar, Toolbar, Badge, Tooltip } from '@material-ui/core';
import cssstyles from '../styles/Dashboard.module.css';
import { withStyles } from '@material-ui/core/styles'; 

const drawerWidth = 190;

const styles = theme => ({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: 'hsl(120, 82%, 33%)',
    },
    toolbar: theme.mixins.toolbar,
    header: {
      display: 'flex',
    },
    customBadge: {
        backgroundColor: "red"
    }
});  

class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pop_open: false,
            anchorEl: null
        }
    }

    //for opening the pop over
    handleClick = (event) => {
		this.setState({
			pop_open: true,
			anchorEl: event.currentTarget,
		});
    }

    //for closing the pop over
	handleClose = () => {
        this.setState({
            pop_open: false,
            anchorEl: null
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography 
                            variant="h5" 
                            noWrap 
                            className={cssstyles.pageHeader}
                        >
                            Hi {this.props.email}
                        </Typography>
						<Tooltip title="Notifications">
                            <IconButton 
                                style={{
                                    color: 'white',
                                    marginRight: '5px'
                                }}
                            >
                                <Badge 
                                    badgeContent={3} 
                                    classes={{ 
                                        badge: classes.customBadge 
                                    }}
                                >
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

						<IconButton onClick={this.handleClick}>
							<Avatar alt={this.props.email} src={this.props.profilePhoto} />
						</IconButton>

						<PopOver 
							pop_open={this.state.pop_open} 
							anchorEl={this.state.anchorEl}
							isLoggedIn={this.props.isLoggedIn} 
							handleLogout={this.props.handleLogout}
                            handleLogoutSuccess={this.props.handleLogoutSuccess}
							handleClose={this.handleClose}
							googleSignIn={this.props.googleSignIn} 
						/>
					</Toolbar>
				</AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(Header);
