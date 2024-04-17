import React from "react";
import './Clock.scss'

class Clock extends React.Component {
    //-----------------------
    constructor(props) {
        super(props)
        this.state = {
            breakLength: props.defaultBreakLength || 5,
            defaultBreakLength: props.defaultBreakLength || 5,
            sessionLength: props.defaultSessionLength || 25,
            defaultSessionLength: props.defaultSessionLength || 25,
            display: `${props.defaultSessionLength || 25}:00`,
            time: (props.defaultSessionLength || 25) * 60,
            play: false,
            breakOn: false,
            interval: null,
            intervalAmount: parseInt(props.intervalAmount) || 1000,
            muted: props.muted || false
        }
        this.handlePlay = this.handlePlay.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.countDown = this.countDown.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.getDisplay = this.getDisplay.bind(this);
        this.audio = null;
    }
    //-----------------------
    handlePlay() {
        if (this.state.play) {
            return this.handleStop();
        }
        this.setState(state => {
            clearInterval(state.interval);
            let interval = setInterval(this.countDown, state.intervalAmount);
            return { play: true, interval: interval, breakOn: false }
        });

    }
    //-----------------------
    handleStop() {
        this.setState(state => {
            clearInterval(state.interval);
            return { play: false, interval: null }
        });
    }
    //-----------------------
    handleReset() {
        this.setState(state => {
            clearInterval(state.interval);
            return {
                play: false,
                time: state.defaultSessionLength * 60,
                breakLength: state.defaultBreakLength,
                sessionLength: state.defaultSessionLength,
                display: this.getDisplay(state.defaultSessionLength * 60),
                breakOn: false,
                interval: null
            }
        });
        this.audio.pause();
        this.audio.currentTime = 0;
    }
    //-----------------------
    handleUndo() {
        this.setState(state => ({
            time: state.sessionLength * 60,
            display: this.getDisplay(state.sessionLength * 60),
            breakOn: false,
        }))
    }
    //-----------------------
    handleTimeChange(e) {
        let [type, dir] = e.currentTarget.id.split('-');
        this.setState(state => {
            let key = `${type}Length`,
                amount = dir == 'increment' ? 1 : -1,
                value = state[key] + amount;

            value = value <= 0 ? 1 : value;
            value = value > 60 ? 60 : value;

            return {
                [key]: value,
                time: type == 'session' ? value * 60 : state.time,
                display: type == 'session' ? this.getDisplay(value * 60) : state.display
            }
        })
    }
    //-----------------------
    countDown() {
        this.setState(state => {
            let newTime = state.time - 1,
                breakOn = state.breakOn

            if (newTime < 0) {
                breakOn = !state.breakOn;
                newTime = breakOn ? state.breakLength : state.sessionLength;
                newTime = newTime * 60;
                this.state.muted ? null : this.audio.play();
            }

            return {
                time: newTime,
                display: this.getDisplay(newTime),
                breakOn: breakOn
            }
        })
    }
    //-----------------------
    getDisplay(time) {
        let minutes = Math.floor(time / 60) || 0,
            seconds = time - Math.floor(time / 60) * 60 || 0;

        minutes = `${minutes}`.padStart(2, '0')
        seconds = `${seconds}`.padStart(2, '0')
        return `${minutes}:${seconds}`
    }
    //-----------------------
    render() {
        return (
            <div className="clock">
                <div className="title">25 + 5 Clock</div>
                <div className="header px-4">
                    <div className="float-left">
                        <div id="break-label" className="label">Break length</div>
                        <a onClick={this.handleTimeChange} id="break-decrement"><i className="fa fa-minus fa-fw" /></a>
                        <div id="break-length" className="length">{this.state.breakLength}</div>
                        <a onClick={this.handleTimeChange} id="break-increment"><i className="fa fa-plus fa-fw" /></a>
                    </div>
                    <div className="float-right">
                        <div id="session-label" className="label">Session time</div>
                        <a onClick={this.handleTimeChange} id="session-decrement"><i className="fa fa-minus fa-fw" /></a>
                        <div id="session-length" className="length">{this.state.sessionLength}</div>
                        <a onClick={this.handleTimeChange} id="session-increment"><i className="fa fa-plus fa-fw" /></a>
                    </div>
                </div>
                <div id="timer-label" className={`timer-label ${this.state.breakOn ? 'break-on' : ''}`}>
                    {this.state.breakOn ? <span><i className="fa fa-fw fa-hourglass mr-1" />BREAK</span> : 'Session'}
                </div>
                <div id="time-left" className={`display ${this.state.play ? 'play' : ''}`}>
                    {this.state.display}
                </div>
                <div className="buttons">
                    <a id="start_stop" className={`button ${this.state.play ? 'active' : ''}`} onClick={this.handlePlay}>
                        <i className={`fa fa-${this.state.play ? 'stop' : 'play'} fa-fw`} />
                    </a>
                    <a id="reset" className="button" onClick={this.handleReset}><i className="fa fa-trash fa-fw" /></a>
                    <a id="defaults" className="button" onClick={this.handleUndo}><i className="fa fa-undo fa-fw" /></a>
                    <a id="mute" className={`button ${this.state.muted ? 'active' : ''}`} onClick={() => this.setState(state => ({ muted: !state.muted }))}><i className="fa fa-music fa-fw" /></a>
                </div>
                <div className="footer small">
                    <a href="https://github.com/jm-sky/" target="_new">@jm-Sky</a>
                </div>
                <audio id="beep" preload="auto" ref={audio => this.audio = audio} src={this.props.audioSrc} />
            </div>
        )
    }
    //-----------------------
}

export default Clock
