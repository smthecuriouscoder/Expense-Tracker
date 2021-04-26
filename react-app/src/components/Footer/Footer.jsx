import React from "react";
import styles from "./Footer.module.css";

const list = [
  {
    name: "Sagar Mittal",
    mobile: "9671013041",
    email: "mittalsagar555@gmail.com",
  },
  {
    name: "Aman Garg",
    mobile: "7015296109",
    email: "amangarg2631@gmail.com",
  },
  {
    name: "Mukul Goel",
    mobile: "8708093673",
    email: "mukulgoel527@gmail.com",
  },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.footerHeader}>Contact Details:</h2>

      {list.map((person) => (
        <address className={styles.address} key={person.mobile}>
          {person.name}
          <br />
          {person.mobile}
          <br />
          <a href='https://www.gmail.com' target='_blank' rel='noopener noreferrer'>
            {person.email}
          </a>
        </address>
      ))}
    </footer>
  );
}

export default Footer;
