import React from 'react';
import styles from '../../styles/Homepage.module.css';
import {motion} from 'framer-motion';
 
function About(){
  return(
    <motion.div className={styles.about} id="about" whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 300 }}>
          <h1 style={{marginBottom: '10px'}}>About</h1>
          <p style={{textAlign: 'justify'}}>
            The project titled <strong>"Expense Tracker"</strong> is a web application that enables you
            to keep track of  your expenses and manage them. This application allows you to
            maintain a digital automated diary. It will keep a track of your Income-Expense 
            on a day to day basis. You will be able to add your expenditures instantly and
            can review them anytime. You can easily import transactions from your mobile wallets without
            risking your information. You can see the accurate duration for how long a particular product
            is being used by you. The monthly wise comparison of expenditures will be done by the app which
	    will let you know the area where you are spending the most.
          </p>
    </motion.div>
  );
}

export default About;