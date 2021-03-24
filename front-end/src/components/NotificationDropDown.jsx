import React from "react";
import styles from "../styles/NotificationDropDown.module.css";

function CartDropdown() {
  return (
    <div className={styles.cartDropDown}>
      <div className={styles.cartItems}>
        <div style={{ color: "black", alignSelf: "center" }}>No notifications</div>
      </div>
    </div>
  );
}

export default CartDropdown;
