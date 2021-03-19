import React, {Component} from 'react';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { Redirect } from 'react-router-dom';
import FooterLogIn from "./Footerlogin";
import styles from '../styles/Login.module.css';
import {motion} from 'framer-motion';
import axios from 'axios';
import { login } from './apiurl.jsx';
import profile from '../assets/undraw_profile_pic_ic5t.svg';
import bg from '../assets/bg.svg';

let errors;

const emailRegex = RegExp(
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
);

const formValid = errors => {
  let valid=true;

  Object.values(errors).forEach(val => {
    val.length > 0 && (valid=false);
  });

  return valid;
}

class SignUpForm extends Component{
    constructor(props){
        super(props);
    
        this.state={
          email: '',
          password: '',
          errors: {
            emailError: '',
            passwordError: ''
          },
          isSignedIn: false,
	        isSignedInFromGoogle: false
        };
    }    

    handleCallback = (profileObj) => {
	    this.setState({
        email: profileObj.email,
        profilePhoto: profileObj.imageUrl,
        isSignedInFromGoogle: true
      }, () => {
          this.props.handleParentCallBack(this.state.isSignedInFromGoogle, profileObj);
      });

    }

    handleButton =  () => {
      this.props.rotateForm();
    }

    handleEmail = event => {
        event.preventDefault();
        const value = event.target.value;
        errors=this.state.errors;
        errors.emailError = emailRegex.test(value) ? "" : "Please enter a valid email address";

        this.setState((state) => {
          return ({
              email: value,
              errors: {
                emailError: errors.emailError,
                passwordError: state.errors.passwordError
              }
          })
        });
    }
    
    handlePassword = event => {
        event.preventDefault();
        const value = event.target.value;
        errors=this.state.errors;        
        errors.passwordError = (value.length < 6) ? "Password length must be greater than 5 characters" : "";

        this.setState( (state) => {
          return({
              password: value,
              errors: {
                emailError: state.errors.emailError,
                passwordError: errors.passwordError
              }
          })
        });
      }

    handleSubmit = event => {
        event.preventDefault();
        const {email, password, errors}=this.state;

        if(email.length === 0){
          errors.emailError = "Please fill out this field";
        }

        if(password.length === 0){
          errors.passwordError = "Please fill out this field";
        }

        this.setState({
          errors: {
            emailError: errors.emailError,
            passwordError: errors.passwordError
          }
        });

        if(formValid(errors)){
          const userDetails ={
            email: email,
            password: password
          }
          // const token = Buffer.from(`${email}:${password}`).toString('base64')
          axios.post(login, userDetails).then( res => {
              console.log(res.data)
              localStorage.setItem("token", res.data.token)
          
              this.setState(() => {
                return({
                    isSignedIn: true
                })
              });
              this.props.handleParentCallBack(true, res.data.request);
          }, (error)=>{
              console.log("invalid user or password")
          })
        }
    }

    render() {
        const passError=this.state.errors.passwordError;
        const eError=this.state.errors.emailError;
        const isSignedIn=this.state.isSignedIn;
	      const isSignedInFromGoogle=this.state.isSignedInFromGoogle;

        return(
            <div className={`${styles.signupblock} ${this.props.btn}`}>
                <div className={`${styles.instructsignup}`}>
                    <motion.h1 initial={{opacity: 0, scale: 0}} animate={{opacity: 1, scale: 1}} transition={{duration: 1}}>WELCOME!</motion.h1>
                    <img src={bg} alt="background" className={styles.svgImage} />
                    <motion.h4 initial={{opacity: 0, scale: 0}} animate={{opacity: 1, scale: 1}} transition={{duration: 1}} className={styles.desc}>Enter your personal details and start with us.</motion.h4>
                    <motion.button initial={{opacity: 0, scale: 0}} animate={{opacity: 1, scale: 1}} whileTap={{scale: 1.3}} onClick={this.handleButton}>Sign Up</motion.button>
                </div>
                
                <div className={`${styles.content}`}>
                    <img src={profile} alt="wallet" style={{ width: '80px'}} />
                    <h1>Sign in</h1>
                    <form className={styles.signinform} onSubmit={this.handleSubmit} >

                      <div className={`${styles.icon}`}>
			                  <EmailIcon className={styles.iconItems} />
                        <input          
                          type="text" 
                          placeholder="Your Email" 
                          value={this.state.email} 
                          onChange={this.handleEmail}
			                    autoFocus
                          className={`${styles.takeInput} ${eError.length>0 ? styles.error : styles.applyBorder}`}
                        />
                        {eError.length > 0 
                         ? (<span className={styles.msgError}>{eError}</span>) : null
                        }
                      </div>

                      <div className={`${styles.icon}`}>
			                  <LockIcon className={styles.iconItems} />
                        <input 
                          type="password" 
                          placeholder="Your Password" 
                          value={this.state.password} 
                          onChange={this.handlePassword} 
                          className={`${styles.takeInput} ${passError.length>0 ? styles["error"] : styles["applyBorder"]}`}
                        />
                        {passError.length > 0 
                         ? (<span className={styles.msgError}>{passError}</span>) : null
                        }
                      </div>
                      
                      <button type="submit">Sign In</button>                     
                      { isSignedIn || isSignedInFromGoogle ? <Redirect to={{
                                                      pathname: "/dashboard",
                                                      state: { email: this.state.email,
                                                               profilePhoto: this.state.profilePhoto,
								                                               googleSignIn: this.state.isSignedInFromGoogle
                                                      }   
						                                    }} />
                      : null }
		                  <FooterLogIn parentCallback = {this.handleCallback} signInStatus = { this.state.isSignedInFromGoogle }/>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignUpForm;