import React, { Component } from 'react';
import FooterLogIn from "./Footerlogin";
import styles from '../styles/Login.module.css';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { Redirect } from 'react-router-dom';
import {motion} from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { signup } from './apiurl.jsx'

let errors;
const emailRegex = RegExp(
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
);

const formValid = errors => {
  let valid = true;

  Object.values(errors).forEach(val => {
    val.length > 0 && (valid=false);
  });

  return valid;
}

class SignInForm extends Component{
    constructor(props){
        super(props);
    
        this.state={
          name: '',
          email: '',
	        contact: '',
          password: '',
          errors: {
            unameError: '',
            emailError: '',
	          contactError: '',
            passwordError: ''
          },
          isSignedIn: false,
	        isSignedInFromGoogle: false
        };
    }

    handleCallback = (profileObj) => {
	    this.setState({
        name: profileObj.name, 
        email: profileObj.email, 
        profilePhoto: profileObj.imageUrl,
        isSignedInFromGoogle: true
      });
      this.props.handleParentCallBack(this.state.isSignedInFromGoogle, profileObj);
    }

    handleButton = () => {
      this.props.rotateForm();
    }

    handleName = event => {
      const value = event.target.value;
      errors=this.state.errors;
      errors.unameError = (value.length < 3) ? "Minimum 3 characters required" : "";

      this.setState((state) => {
        return ({
            name: value,
            errors: {
              unameError: errors.unameError,
              emailError: state.errors.emailError,
              contactError: state.errors.contactError,
              passwordError: state.errors.passwordError
            }
        })
      });
    }
    
    handleEmail = event => {
        const value = event.target.value;
	      errors=this.state.errors;
        errors.emailError = emailRegex.test(value) ? "" : "Please enter a valid email address";

        this.setState((state) => {
          return ({
              email: value,
              errors: {
		            unameError: state.errors.unameError,
                emailError: errors.emailError,
                contactError: state.errors.contactError,
                passwordError: state.errors.passwordError
              }
          })
        });
    }
    
    handleContact = value => {
        errors=this.state.errors;
	      errors.contactError = (value.length === 0) ? "Please fill out this field" : "";

        this.setState((state) => {
          return ({
              contact: value,
              errors: {
		            unameError: state.errors.unameError,
                emailError: state.errors.emailError,
                contactError: errors.contactError,
                passwordError: state.errors.passwordError
              }
          })
        });
    }

    handlePassword = event => {
        const value = event.target.value;
        errors=this.state.errors;
        errors.passwordError = (value.length < 6) ? "Password length must be greater than 5 characters" : "";

        this.setState( (state) => {
          return({
              password: value,
              errors: {
                unameError: state.errors.unameError,
                emailError: state.errors.emailError,
                contactError: state.errors.contactError,
                passwordError: errors.passwordError
              }
          })
        });
    }
    
    handleSubmit = event => {
      event.preventDefault();
      const {name,email,contact,password,errors} = this.state;

      if(name.length === 0){
        errors.unameError = "Please fill out this field";
      }

      if(email.length === 0){
        errors.emailError = "Please fill out this field";
      }

      if(contact.length === 0){
        errors.contactError = "Please fill out this field";
      }

      if(password.length === 0){
        errors.passwordError = "Please fill out this field";
      }

      this.setState({
        errors: {
          unameError: errors.unameError,
          emailError: errors.emailError,
          contactError: errors.contactError,
          passwordError: errors.passwordError
        }
      });

      if(formValid(errors)){
        const userDetails ={
          name: name,
          email: email,
          contact: contact,
          password: password
        }

        axios.post(signup,userDetails).then( res => {
          console.log(res.data);
          alert("Account Created Successfully");

          this.setState(() => {
            return({
                isSignedIn: true
            })
          });
          this.props.handleParentCallBack(this.state.isSignedIn, res.data.userDetails);
        })

      }
    }

    render(){
      const {unameError, emailError, contactError, passwordError} = this.state.errors;
      const isSignedIn=this.state.isSignedIn;
      const isSignedInFromGoogle=this.state.isSignedInFromGoogle;

      return(
            <div className={`${styles.signinblock} ${this.props.status ? styles.frontblock : ''} ${this.props.btn}`}>

              <div className={`${styles.instructlogin}` }>
                  <h1>Welcome Back!</h1>
                  <p className={styles.desc}>Let's have a watch on the expenses</p>
                  <motion.button whileTap={{scale: 1.3}} onClick={this.handleButton}>Sign In</motion.button>
              </div>

              <div className={`${styles.content1}`}>
                  <h1>Create Account</h1>

                  <form className={styles.signupform} onSubmit={this.handleSubmit} >
                    <div className={`${styles.icon}`}>
                      <PersonAddIcon className={styles.iconItems} />
                      <input 
                        type="text" 
                        placeholder="Name" 
                        value={this.state.name} 
                        onChange={this.handleName}
                        className={`${styles.takeInput} ${unameError.length>0 ? styles["error"] : styles["applyBorder"]}`}
                      />
                      {unameError.length > 0 
                         ? (<span className={styles.msgError}>{unameError}</span>) : null
                      }
                    </div>

                    <div className={`${styles.icon}`}>
		                  <EmailIcon className={styles.iconItems} />
                      <input           
                          type="text" 
                          placeholder="Email" 
                          value={this.state.email} 
                          onChange={this.handleEmail}
                          className={`${styles.takeInput} ${emailError.length>0 ? styles["error"] : styles["applyBorder"]}`}
                        />
                        {emailError.length > 0 
                         ? (<span className={styles.msgError}>{emailError}</span>) : null
                        }
                    </div>
		    <div style={{margin: '5px 0', width: '70%'}} >
		    <PhoneInput
		      placeholder="Phone number"
		      country={'in'}
		      enableSearch
		      value={this.state.contact}
		      onChange={this.handleContact}
		      inputClass={`${contactError.length>0 ? styles["error"] : styles["applyBorder"]}`}
		      buttonClass={`${contactError.length>0 && styles["flagIcon"]}`}
		     
		      inputStyle={{
            padding: '8px 3px 8px 48px',
            margin: '5px',
            width: '100%',
            backgroundColor: 'transparent',
            transition: 'all 0.5s',
            borderRadius: 0
		      }}
		      buttonStyle={{
            border: '0px solid rgba(245, 245, 245, 0.884)',
            borderBottom: '1px solid black',
            borderRadius: 0,
            marginLeft: '10px',
            paddingTop: '1px',
            backgroundColor: 'transparent'
		      }}
		    />

		    {contactError.length > 0 
                         ? (<span className={styles.msgError}>{contactError}</span>) : null
                    }
		    </div>
		    
                    <div className={`${styles.icon}`}>
                      <LockIcon className={styles.iconItems} />
                      <input 
                          type="password" 
                          placeholder="Password" 
                          value={this.state.password} 
                          onChange={this.handlePassword} 
                          className={`${styles.takeInput} ${passwordError.length>0 ? styles["error"] : styles["applyBorder"]}`}
                      />
                      {passwordError.length > 0 
                         ? (<span className={styles.msgError}>{passwordError}</span>) : null
                      }
                    </div>
                    
                    <button type="submit">Sign Up</button>
		                { isSignedIn || isSignedInFromGoogle ? <Redirect to={{
                                                    pathname: "/dashboard",
                                                    state: { 
                                                      email: this.state.email,
                                                      profilePhoto: this.state.profilePhoto,
                                                      googleSignIn: this.state.isSignedInFromGoogle
                                                    }
                                              }}/>
                    : null }
                    <FooterLogIn parentCallback = {this.handleCallback} />
                  </form>
              </div>
          </div>
      );
    }
}

export default SignInForm;