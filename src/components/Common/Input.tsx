import React from 'react'
import styles from './Input.module.css'

interface Props {
  type: 'file'
}

const Input: React.FC<Props> = ({
  type,
}) => {
  return (
    <input
      className={styles.Input}
    />
  )
}

export default Input
