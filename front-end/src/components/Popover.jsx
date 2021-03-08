import React from 'react';
import { Button, Popover } from '@material-ui/core';
import { GoogleLogout } from "react-google-login";
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Redirect } from 'react-router-dom';
import cssstyles from '../styles/Dashboard.module.css';

function PopOver({ pop_open, anchorEl, isLoggedIn, handleLogout, handleLogoutSuccess, handleClose, googleSignIn }) {
    const handleLogoutFailure = (res) => {
        console.log('Logout Failed: ', res);
    }

    return (
        <div>
            <Popover
                elevation={4}
                open={pop_open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                PaperProps={{
                    style: { width: '280px', height: '130px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'space-evenly',justifyContent: 'space-around' },
                }}
                className={cssstyles.popContainer}
            >
                <p>Do you want to log out?</p>
                <div className={cssstyles.popButtons}>
                    {googleSignIn ? 
                        (<GoogleLogout
                            clientId="636027814315-mmq95unab27g2qj1qfdkd4eub10e24tj.apps.googleusercontent.com"
                            theme="dark"
                            onLogoutSuccess={handleLogoutSuccess }
                            onFailure={handleLogoutFailure }
                        > 
                            Log Out 
                        </GoogleLogout>) : 
                        (<Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleLogout} 
                            startIcon={<ExitToAppIcon />}
                        >
                            Log out
                        </Button>)
                    }
                    {isLoggedIn ? null : <Redirect to="/login" />}
            
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<CloseIcon />}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </div>
			</Popover>
        </div>
    )
}

export default PopOver;
