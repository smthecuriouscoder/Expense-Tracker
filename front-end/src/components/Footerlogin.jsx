import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import styles from "../styles/Footerlogin.module.css";

class FooterLogIn extends Component {
  onSuccess = (res) => {
    this.props.parentCallback(res.profileObj);
  };

  onFailure = (res) => {
    alert("Login Failed: ", res);
  };

  render() {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div className={styles.optionLogIn}>
          <hr className={styles.separateLogIn} />
          <span className={styles.optionOr}>or</span>
          <hr className={styles.separateLogIn} />
        </div>

        <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENTID}
            theme='dark'
            onSuccess={this.onSuccess}
            onFailure={this.onFailure}
          >
            Sign in with Google
          </GoogleLogin>
        </div>
      </div>
    );
  }
}

export default FooterLogIn;
