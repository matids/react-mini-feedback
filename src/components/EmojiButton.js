import React from 'react'
import styles from '../styles.module.scss'

function EmojiButton({ url, active, onClick }) {
  return (
    <button
      className={`${styles.feedbackEmojiButton} ${active && styles.selected}`}
      onClick={onClick}
    >
      <span className={styles.feedbackEmoji}>
        <img decoding='async' width='20' height='20' src={url} alt='emoji' />
      </span>
    </button>
  )
}

export default EmojiButton
