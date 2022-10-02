import React from 'react'

import styles from 'styles/Loading.module.css'

interface LoadingProps {
    
}
const Loading:React.FC<LoadingProps> = ({ })=>{
    return (
      <div className={styles.full_page}>
         <div className={styles.container}>
            <div className={`${styles.bubble} ${styles.bubble1}`} />
            <div className={`${styles.bubble} ${styles.bubble2}`} />
            <div className={`${styles.bubble} ${styles.bubble3}`} />
         </div>
      </div>

    )
}

export default Loading