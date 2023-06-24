import React from 'react'
import styles from './Button.module.css'

interface Props {
  children?: React.ReactNode
  height?: string
  width?: string
  type: 'submit' | 'button' | 'reset'
  onClick?: () => void
}

const Button: React.FC<Props> = ({
  children,
  height,
  width,
  type,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        height,
        width,
      }}
      className={styles.Button}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
