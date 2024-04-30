import { useState, useRef, createRef, useEffect, useCallback } from 'react'
import './Clock.scss'
import FaIcon from './components/FaIcon'
import Footer from './components/Footer'

const DEFAULT_BREAK_LENGTH = 5
const DEFAULT_SESSION_LENGTH = 25
const DEFAULT_INTERVAL_AMOUNT = 1000
const DEFAULT_AUDIO_SRC = '/assets/beepSound.wav'

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

export default function Clock(props: IProps) {
  const audioRef = createRef<HTMLAudioElement>()
  const intervalId = useRef<number>()

  const intervalAmount = props.intervalAmount ?? DEFAULT_INTERVAL_AMOUNT
  const defaultBreakLength = props.defaultBreakLength ?? DEFAULT_BREAK_LENGTH
  const defaultSessionLength = props.defaultSessionLength ?? DEFAULT_SESSION_LENGTH

  const [breakLength, setBreakLength] = useState<number>(props.defaultBreakLength ?? storedInteger('clock.breakLength') ?? DEFAULT_BREAK_LENGTH)
  const [sessionLength, setSessionLength] = useState<number>(props.defaultSessionLength ?? storedInteger('clock.sessionLength') ?? DEFAULT_SESSION_LENGTH)
  const [display, setDisplay] = useState<string>(`${props.defaultSessionLength ?? DEFAULT_SESSION_LENGTH}:00`)
  const [time, setTime] = useState<number>((props.defaultSessionLength ?? DEFAULT_SESSION_LENGTH) * 60)
  const [play, setPlay] = useState<boolean>(false)
  const [breakOn, setBreakOn] = useState<boolean>(false)
  const [muted, setMuted] = useState<boolean>(props.muted ?? false)
  const [audioSrc] = useState<string>(props.audioSrc ?? DEFAULT_AUDIO_SRC)

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
      <div className="title">25 + 5 Clock</div>
      <div className="header px-4">
        <div className="float-left">
          <div id="break-label" className="label">Break length</div>
          <a onClick={() => changeBreakTime(-1)}><FaIcon icon="minus" /></a>
          <div id="break-length" className="length">{breakLength}</div>
          <a onClick={() => changeBreakTime(1)}><FaIcon icon="plus" /></a>
        </div>
        <div className="float-right">
          <div id="session-label" className="label">Session time</div>
          <a onClick={() => changeSessionTime(-1)}><FaIcon icon="minus" /></a>
          <div id="session-length" className="length">{sessionLength}</div>
          <a onClick={() => changeSessionTime(1)}><FaIcon icon="plus" /></a>
        </div>
      </div>
      <div id="timer-label" className={`timer-label ${breakOn ? 'break-on' : ''}`}>
        {breakOn ? <span><FaIcon icon="hourglass" mr />BREAK</span> : 'Session'}
      </div>
      <div id="time-left" className={`display ${play ? 'play' : ''}`}>
        {display}
      </div>
      <div className="buttons">
        <a id="start_stop" className={`button ${play ? 'active' : ''}`} onClick={togglePlay}>
          <FaIcon icon={`${play ? 'stop' : 'play'}`} />
        </a>
        <a id="reset" className="button" onClick={handleReset}><FaIcon icon="trash" /></a>
        <a id="defaults" className="button" onClick={handleUndo}><FaIcon icon="undo" /></a>
        <a id="mute" className={`button ${muted ? 'active' : ''}`} onClick={() => setMuted(!muted)}>
          <FaIcon icon="music" />
        </a>
      </div>
      <Footer />
      <audio id="beep" preload="auto" ref={audioRef} src={audioSrc} />
    </div>
}