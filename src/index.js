import React, { useRef, useEffect, useReducer } from 'react'
import styles from './styles.module.scss'
import EmojiButton from './components/EmojiButton'

const useOutsideAlerter = (ref, onClick) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}
const defaultEmojis = [
  { name: 'blownAway', img: 'https://assets.vercel.com/twemoji/1f929.svg' },
  { name: 'happy', img: 'https://assets.vercel.com/twemoji/1f600.svg' },
  { name: 'sad', img: 'https://assets.vercel.com/twemoji/1f615.svg' },
  { name: 'crying', img: 'https://assets.vercel.com/twemoji/1f62d.svg' }
]

const STATUS = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
  SUCCESS: 'SUCCESS'
}

const initialState = {
  message: '',
  emoji: undefined,
  status: STATUS.CLOSED
}

function Feedback({
  placeholder = 'Leave us feedback...',
  buttonText = 'Feedback',
  sendButtonText = 'Send',
  thankYouMessage = 'Thank you for your feedback!',
  emojis = defaultEmojis,
  onSend
}) {
  const [{ message, emoji, status }, dispatch] = useReducer(
    (s, a) => ({ ...s, ...a }),
    initialState
  )

  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, () => dispatch({ status: STATUS.CLOSED }))

  useEffect(() => {
    if (status !== STATUS.SUCCESS) return
    const timeoutId = setTimeout(() => {
      dispatch(initialState)
    }, 2000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [status])

  const send = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSend({ message, emoji })
    dispatch({ ...initialState, status: STATUS.SUCCESS })
  }

  const body = () => {
    return (
      <form className={styles.feedbackBody} onSubmit={send}>
        <h5>{buttonText}</h5>
        <div className={styles.feedbackContainer}>
          <textarea
            placeholder={placeholder}
            value={message}
            onChange={(e) => dispatch({ message: e.target.value })}
            required
          />
        </div>
        {footer()}
      </form>
    )
  }

  const footer = () => {
    return (
      <div className={styles.feedbackFooter}>
        <div className={styles.emojiList}>
          {emojis.map((anEmoji) => (
            <EmojiButton
              key={anEmoji.name}
              url={anEmoji.img}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dispatch({
                  emoji:
                    !emoji || emoji.name !== anEmoji?.name ? anEmoji : undefined
                })
              }}
              active={emoji?.name === anEmoji.name}
            />
          ))}
        </div>
        <button type='submit' className={styles.submit}>
          {sendButtonText}
        </button>
      </div>
    )
  }

  const successBody = () => {
    return (
      <div className={styles.successBody}>
        <img
          decoding='async'
          width='64'
          height='64'
          src='https://assets.vercel.com/twemoji/1f64c.svg'
        />
        <h5>{thankYouMessage}</h5>
      </div>
    )
  }

  const isOpened = status === STATUS.OPENED || status === STATUS.SUCCESS
  const isSuccess = status === STATUS.SUCCESS
  return (
    <div
      ref={wrapperRef}
      className={`${styles.feedbackComp} ${isOpened ? styles.opened : ''} `}
    >
      <div className={styles.feedbackWrapper}>
        {isOpened ? (
          !isSuccess ? (
            body()
          ) : (
            successBody()
          )
        ) : (
          <button
            className={`${styles.open} ${isSuccess ? styles.success : ''}`}
            onClick={() => {
              dispatch({ status: STATUS.OPENED })
            }}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}

export default Feedback
