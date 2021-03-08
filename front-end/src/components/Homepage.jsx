import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import NavBar from './homepage/navbar';
import Banner from './homepage/banner';
import About from './homepage/about';
import Footer from './homepage/footer';
import styles from '../styles/Homepage.module.css';
import wallet from '../undraw_wallet_aym5.svg';

const items = ["Home","About","Contact Us","Log In"];
const itemObjects = items.map((item,i) => ({ id: i, navItem: item }));

class HomePage extends Component {
  
  handleLogInClick = () => {
    if(this.props.loggedInStatus){
      this.props.history.goForward();
    }
    else{
      this.props.history.push('/login');
    }
  }

  render() { 
    return (
      <div className={styles.container}>
          <NavBar navItemObjects={itemObjects} handleLogInClick={this.handleLogInClick} />
          <Banner firstTitle="Expense" secondTitle="Tracker" handleLogInClick={this.handleLogInClick} />
	        <div style={{display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', width: '100%'}}>
	          <h1 style={{ width: '450px', padding: '25px'}} >Track your Expenses and Be a Money Saver</h1>
	          <img src={wallet} alt="wallet" style={{ width: '480px'}} />
	        </div>
	        <About />
          <Footer />
      </div>      
    );
  }
}

export default withRouter(HomePage);