import React from "react";
import money from "../../assets/Money_preview_rev_1.png";
import ReactTooltip from "react-tooltip";
import { motion } from "framer-motion";
import styles from "../../styles/Homepage.module.css";

function Banner(props) {
  const { firstTitle, secondTitle, handleLogInClick } = props;

  const expenseVariants = {
    initial: {
      y: "-100vh",
    },
    animate: {
      y: 0,
      transition: {
        delay: 0.9,
        type: "spring",
        stiffness: 120,
      },
    },
    whileHover: {
      scale: [1, 1.1, 1, 1.1, 1, 1.1, 1],
    },
  };

  const trackerVariants = {
    initial: {
      y: "-100vh",
    },
    animate: {
      y: 0,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 120,
      },
    },
    whileHover: {
      scale: [1, 1.1, 1, 1.1, 1, 1.1, 1],
    },
  };

  return (
    <div className={styles.banner}>
      <div className={styles.heading}>
        <motion.h1
          whileHover='whileHover'
          initial='initial'
          animate='animate'
          variants={expenseVariants}
          className={styles.expense}
        >
          {firstTitle}
        </motion.h1>
        <motion.h1
          whileHover='whileHover'
          initial='initial'
          animate='animate'
          variants={trackerVariants}
          className={styles.track}
        >
          {secondTitle}
        </motion.h1>
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 120 }}
          className={styles.getStartedDiv}
        >
          <button
            className={styles.getStarted}
            onClick={handleLogInClick}
            data-tip="Let's start with the management of expenses"
            data-place='right'
          >
            Get Started
          </button>
        </motion.div>

        <ReactTooltip
          type='info'
          effect='solid'
          className={styles.tip}
        ></ReactTooltip>
      </div>
      <div className={styles.moneyImg}>
        <img
          src={money}
          alt='money'
          className={`${styles["App-logo"]}`}
          style={{ width: "90%" }}
        />
      </div>
    </div>
  );
}

export default Banner;
