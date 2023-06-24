import React from 'react'
import styles from './Box.module.css'

interface Props {
  children?: React.ReactNode
  classes?: string
}

const Box: React.FC<Props> = ({ children, classes }) => {
  return <div className={`${styles.Box} ${classes}`}>{children}</div>
}

export default Box
