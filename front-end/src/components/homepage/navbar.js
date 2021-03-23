import React from "react";
import styles from "../../styles/Homepage.module.css";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

function NavBar(props) {
  const { navItemObjects, handleLogInClick } = props;

  return (
    <nav className={styles.navbar}>
      <span
        style={{ cursor: "pointer" }}
        onClick={handleLogInClick}
        className={styles.navlink}
      >
        {navItemObjects[3].navItem}
      </span>
      <HashLink to='/#footer' replace smooth className={styles.navlink}>
        {navItemObjects[2].navItem}
      </HashLink>
      <HashLink to='/#about' replace smooth className={styles.navlink}>
        {navItemObjects[1].navItem}
      </HashLink>
      <Link to='/' replace className={styles.navlink}>
        {navItemObjects[0].navItem}
      </Link>
    </nav>
  );
}

export default NavBar;
