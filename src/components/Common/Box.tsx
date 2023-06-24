import React from 'react'
import styles from './Box.module.css'

interface Props {
  children?: React.ReactNode
  title?: string
  classes?: string
}

const Box: React.FC<Props> = ({ children, title, classes }) => {
  return (
    <div className={`${styles.Box} ${classes}`}>
      {title && <h2 className={`${styles.Title}`}>{title}</h2>}
      {children}
    </div>
  )
}

export default Box
