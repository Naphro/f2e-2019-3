import React, {Component, Fragment} from 'react'
import shuffle from "../../assets/svg/btn_ShufflePlayback.svg";
import rewind from "../../assets/svg/btn_Rewind.svg";
import play from "../../assets/svg/btn_Play.svg";
import pause from "../../assets/svg/btn_pause.svg"
import fast from "../../assets/svg/btn_Fast.svg";
import repeatOne from "../../assets/svg/btn_RepeatOne.svg";
import repeatAll from "../../assets/svg/btn_RepeatAll.svg"
import './Audio.css'
import {PLAY, PAUSE, REPEAT_ALL, REPEAT_ONE} from "../../constans/actions";
import tracks from "../../constans/tracks";
import {setTime} from '../../utils/index'

class Audio extends Component {
    constructor(props) {
        super(props);
        this.audio = React.createRef();
        this.state = {
            myTracks: tracks.slice(0, tracks.length - 1),
            selectedTrack: tracks[tracks.length - 1],
            status: PAUSE,
            repeat: REPEAT_ALL,
            currentTime: 0,
            duration: 0,
            percentage: 0,
        }
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.repeatAll = this.repeatAll.bind(this);
        this.repeatOne = this.repeatOne.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.rewind = this.rewind.bind(this);
        this.fast = this.fast.bind(this);
        this.clickBar = this.clickBar.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
        this.audio.current.addEventListener('timeupdate', this.updateTime);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (this.state.selectedTrack !== prevState.selectedTrack) {
        //     let track = tracks.filter(item => item.name === this.state.selectedTrack)[0]
        //
        //     if (track) {
        //         this.audio.current.src = track.source;
        //     }
        // }

        if (this.state.myTracks.length !== prevState.myTracks.length) {
            console.log(this.state)
        }

        if (this.state.status !== prevState.status) {
            switch (this.state.status) {
                case PAUSE:
                    this.audio.current.pause();
                    break;
                case PLAY:
                    this.audio.current.play();
                    break;
                default:
                    break;
            }
        }
    }

    componentWillUnmount() {
        this.audio.current.removeEventListener('timeupdate', this.updateTime)
        this.audio.current.src = '';
    }

    updateTime(e) {
        const currentTime = e.target.currentTime;
        const duration = e.target.duration;

        if (currentTime >= duration) {
            // after change tracks, IF expression alwarys return false because of duration could be NaN
            this.next();
        } else {
            let update = {
                currentTime: currentTime,
                duration: duration,
                percentage: Math.floor((currentTime / duration) * 1000) / 10
            }

            this.setState({
                ...this.state,
                ...update
            })
        }
    }

    rewind() {
        this.audio.current.currentTime -= 5;
    }

    fast() {
        this.audio.current.currentTime += 5;
    }

    play() {
        this.setState({
            ...this.state,
            status: PLAY
        })
    }

    pause() {
        this.setState({
            ...this.state,
            status: PAUSE
        })
    }

    next() {
        if (this.state.myTracks.length > 0) {
            const myTracks = [...this.state.myTracks];
            const selectedTrack = myTracks.pop();
            this.setState({
                ...this.state,
                myTracks: myTracks,
                selectedTrack: selectedTrack
            })
            this.audio.current.play();
        } else {
            // if (this.state.repeat === REPEAT_ALL) {
            //     const myTracks = [...tracks];
            //     const selectedTrack = myTracks.pop();
            //     this.setState({
            //         ...this.state,
            //         myTracks: myTracks,
            //         selectedTrack: selectedTrack
            //     })
            // } else {
                this.setState({
                    ...this.state,
                    status: PAUSE
                })
            // }
        }

    }

    repeatAll() {
        this.setState({
            ...this.state,
            repeat: REPEAT_ALL,

        })
    }

    repeatOne() {
        this.setState({
            ...this.state,
            repeat: REPEAT_ONE
        })
    }

    clickBar(e) {
        const percent = (e.clientX - 30) / e.target.offsetWidth;
        this.audio.current.currentTime = percent * this.state.duration;
    }

    render() {
        return (
            <Fragment>
                <audio ref={this.audio} src={this.state.selectedTrack.source}></audio>
                <div className="song-name">{this.state.selectedTrack.name}</div>
                <div className="artist">{this.state.selectedTrack.artist}</div>

                <div className="progress" onClick={this.clickBar}>
                    <div className="total">
                        <div className="past-bar" style={{width: this.state.percentage + '%'}}></div>
                        <div className="past-point" style={{left: this.state.percentage + '%'}}></div>
                    </div>
                </div>
                <div className="time">
                    <div className="left">{setTime(this.state.currentTime)}</div>
                    <div className="right">{setTime(this.state.duration)}</div>
                </div>

                <div className="control">
                    <img src={shuffle} alt="shuffle"/>
                    <img src={rewind} alt="rewind" onClick={this.rewind}/>
                    {
                        this.state.status === PLAY ?
                            <img src={pause} alt="pause" onClick={this.pause}/> :
                            <img src={play} alt="play" onClick={this.play}/>
                    }
                    <img src={fast} alt="fast" onClick={this.fast}/>
                    {
                        this.state.repeat === REPEAT_ALL ?
                            <img src={repeatAll} alt="repeat all" onClick={this.repeatOne}/> :
                            <img src={repeatOne} alt="repeat one" onClick={this.repeatAll}/>

                    }
                </div>
            </Fragment>
        )
    }
}

export default Audio