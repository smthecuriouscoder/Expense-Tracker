import React from "react";
import styles from "../styles/NotificationDropDown.module.css";

function CartDropdown() {
  return (
    <div className={styles.cartDropDown}>
      <div style={{ color: "black", alignSelf: "center", padding: "10px" }}>No notifications</div>
    </div>
  );
}

export default CartDropdown;
