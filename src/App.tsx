import { useState, useRef, createRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import '@/scss/App.scss'
import FaIcon from '@/components/FaIcon'
import Footer from '@/components/Footer'
import * as DEFAULTS from '@/defaults'

const integer = (input?: number | string | null) => {
  const output = parseInt(`${input}`)

  return isNaN(output) ? undefined : output
}

const storedInteger = (key: string) => integer(localStorage.getItem(key))

interface IProps {
  defaultBreakLength?: number
  defaultSessionLength?: number
  intervalAmount?: number
  muted?: boolean
  audioSrc?: string
}

export default function App(props: IProps) {
  const { t } = useTranslation()

  const audioRef = createRef<HTMLAudioElement>()
  const intervalId = useRef<number | NodeJS.Timeout>()

  const intervalAmount = props.intervalAmount ?? DEFAULTS.INTERVAL_AMOUNT
  const defaultBreakLength = props.defaultBreakLength ?? DEFAULTS.BREAK_LENGTH
  const defaultSessionLength = props.defaultSessionLength ?? DEFAULTS.SESSION_LENGTH

  const [breakLength, setBreakLength] = useState<number>(props.defaultBreakLength ?? storedInteger('clock.breakLength') ?? DEFAULTS.BREAK_LENGTH)
  const [sessionLength, setSessionLength] = useState<number>(props.defaultSessionLength ?? storedInteger('clock.sessionLength') ?? DEFAULTS.SESSION_LENGTH)
  const [display, setDisplay] = useState<string>(`${props.defaultSessionLength ?? DEFAULTS.SESSION_LENGTH}:00`)
  const [time, setTime] = useState<number>((props.defaultSessionLength ?? DEFAULTS.SESSION_LENGTH) * 60)
  const [play, setPlay] = useState<boolean>(false)
  const [breakOn, setBreakOn] = useState<boolean>(false)
  const [muted, setMuted] = useState<boolean>(props.muted ?? false)
  const [audioSrc] = useState<string>(props.audioSrc ?? DEFAULTS.AUDIO_SRC)

  const stopAndClearInterval = () => {
    clearInterval(intervalId.current)
    setPlay(false)
  }

  useEffect(() => {
    return () => stopAndClearInterval()
  }, [])

  useEffect(() => {
    if (!play) return
    
    if (intervalId.current) {
      clearInterval(intervalId.current)
    }

    intervalId.current = setInterval(() => {
      let newTime = time - 1

      if (newTime < 0) {
        setBreakOn(!breakOn)
        newTime = breakOn ? breakLength : sessionLength;
        newTime = newTime * 60;
        muted ? null : audioRef.current?.play();
      }
  
      setTime(newTime)
      setDisplay(getDisplay(newTime))
      setBreakOn(breakOn)
    }, intervalAmount)
  }, [audioRef, breakLength, breakOn, intervalAmount, muted, play, sessionLength, time])

  const handlePlay = useCallback(() => {
    setPlay(true)
    setBreakOn(false)
  }, [])

  const togglePlay = useCallback(() => {
    return play ? handleStop() : handlePlay()
  }, [play])

  const handleStop = () => {
    clearInterval(intervalId.current)
    intervalId.current = undefined

    setPlay(false)
  }

  const handleReset = () => {
    clearInterval(intervalId.current)
    intervalId.current = undefined

    setPlay(false),
    setTime(defaultSessionLength * 60)
    setBreakLength(defaultBreakLength),
    setSessionLength(defaultSessionLength)
    setDisplay(getDisplay(defaultSessionLength * 60)),
    setBreakOn(false)

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const handleUndo = () => {
    setTime(sessionLength * 60)
    setDisplay(getDisplay(sessionLength * 60)),
    setBreakOn(false)
  }

  const changeSessionTime = (amount: number = 1) => {
    let value: number = sessionLength + amount

    value = value <= 0 ? 1 : value
    value = value > 60 ? 60 : value

    setSessionLength(value)
    
    setTime(value * 60)
    setDisplay(getDisplay(value * 60))
  }

  const changeBreakTime = (amount: number = 1) => {
    let value: number = breakLength + amount

    value = value <= 0 ? 1 : value
    value = value > 60 ? 60 : value

    setBreakLength(value)
    setTime(time)
    setDisplay(display)
  }

  const getDisplay = (time: number) => {
    const minutes = Math.floor(time / 60) ?? 0
    const seconds = time - Math.floor(time / 60) * 60

    const minutesStr = `${minutes}`.padStart(2, '0')
    const secondsStr = `${seconds}`.padStart(2, '0')

    return `${minutesStr}:${secondsStr}`
  }

  return <div className="clock">
      <div className="title">{t('25 + 5 Clock')}</div>
      <div className="header px-4">
        <div className="float-left">
          <div className="label">{t('Break length')}</div>
          <a onClick={() => changeBreakTime(-1)}><FaIcon icon="minus" /></a>
          <div className="length">{breakLength}</div>
          <a onClick={() => changeBreakTime(1)}><FaIcon icon="plus" /></a>
        </div>
        <div className="float-right">
          <div className="label">{t('Session time')}</div>
          <a onClick={() => changeSessionTime(-1)}><FaIcon icon="minus" /></a>
          <div className="length">{sessionLength}</div>
          <a onClick={() => changeSessionTime(1)}><FaIcon icon="plus" /></a>
        </div>
      </div>
      <div className={`timer-label ${breakOn ? 'break-on' : ''}`}>
        {breakOn ? <span><FaIcon icon="hourglass" mr />{t('BREAK')}</span> : t('Session')}
      </div>
      <div className={`display ${play ? 'play' : ''}`}>
        {display}
      </div>
      <div className="buttons">
        <a className={`button ${play ? 'active' : ''}`} onClick={togglePlay} title={t('Play/Stop')}>
          <FaIcon icon={`${play ? 'stop' : 'play'}`} />
        </a>
        <a className="button" onClick={handleReset} title={t('Reset')}><FaIcon icon="trash" /></a>
        <a className="button" onClick={handleUndo} title={t('Undo')}><FaIcon icon="undo" /></a>
        <a className={`button ${muted ? '' : 'active'}`} onClick={() => setMuted(!muted)} title={t('Sound On/Off')}>
          <FaIcon icon="music" />
        </a>
      </div>
      <Footer />
      <audio preload="auto" ref={audioRef} src={audioSrc} />
    </div>
}