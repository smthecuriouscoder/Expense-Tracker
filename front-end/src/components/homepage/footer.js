import React from "react";
import styles from "../../styles/Homepage.module.css";

function Footer() {
  return (
    <footer className={styles.footerinfo} id='footer'>
      <h2>Contact Details:</h2>
      <address className={styles.address}>
        Sagar Mittal
        <br />
        9671013041
        <br />
        <a
          href='https://www.gmail.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          mittalsagar555@gmail.com
        </a>
      </address>

      <address className={styles.address}>
        Aman Garg
        <br />
        7015296109
        <br />
        <a
          href='https://www.gmail.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          amangarg2631@gmail.com
        </a>
      </address>

      <address className={styles.address}>
        Mukul Goel
        <br />
        8708093673
        <br />
        <a
          href='https://www.gmail.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          mukulgoel527@gmail.com
        </a>
      </address>
    </footer>
  );
}

export default Footer;
