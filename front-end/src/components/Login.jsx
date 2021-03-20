import React, { Component } from 'react';
import styles from '../styles/Login.module.css';
import SignUpForm from './Signupform';
import SignInForm from './Signinform';
import wave from '../assets/wave.png';

class LogIn extends Component {
  constructor(props){
    super(props);

    this.state={
        isLoggedIn: true    //for having the sign in page open to the user rather than sign up page
    };
  }

  changeForm = () => {
      this.setState( prevState => ({
        isLoggedIn: !prevState.isLoggedIn,
      })); 
  }

  handleCall = (status, data) => {
      this.props.handleLogInStatus(status, data);
  }

  render() {
    return (
      <>
        <img src={wave} alt="bg" style={{position: 'fixed', zIndex:'-1', height: '100%'}} />
        <div>
          <h1 className={styles.outermostContainerHead}>Expense Tracker</h1>
          <div className={styles.container}>
            <SignUpForm rotateForm={this.changeForm} handleParentCallBack={this.handleCall} status={this.state.isLoggedIn} btn={ this.state.isLoggedIn ? styles.rotatefront : styles.rotateback  } />
            <SignInForm rotateForm={this.changeForm} handleParentCallBack={this.handleCall} status={this.state.isLoggedIn} btn={ this.state.isLoggedIn ? styles.rotateback : styles.rotatefront } />
          </div>
        </div>
        </>
    );
  }
}

export default LogIn;