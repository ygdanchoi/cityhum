import React from 'react';
import ReactAudioPlayer from 'react-audio-player';

class ExploreSoundPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.handleAudioEnded = this.handleAudioEnded.bind(this);
    this.handleCanPlay = this.handleCanPlay.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.handleClickTimeline = this.handleClickTimeline.bind(this);
    this.stupidWorkaround = this.stupidWorkaround.bind(this);
  }

  componentDidMount() {
    if (this.audioPlayer) {
      this.audioPlayer.audioEl.currentTime = this.props.audioCurrentTime;
      this.stupidWorkaround();
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.audioPlayer) {
      if (newProps.playing) {
        this.audioPlayer.audioEl.play();
      } else {
        this.audioPlayer.audioEl.pause();
      }
    }
  }

  componentDidUpdate(prevProps) {
  }


  componentWillUnmount() {
  }

  toHHMMSS(seconds) {
    let hh = Math.floor(seconds / 3600);
    let mm = Math.floor(seconds / 60) % 60;
    let ss = Math.floor(seconds % 60);
    if (ss < 10) {
      ss = "0" + ss;
    }
    if (hh === 0) {
      return `${mm}:${ss}`;
    } else {
      if (mm < 10) {
        mm = "0" + mm;
      }
      return `${hh.toString()}:${mm.toString()}:${ss.toString()}`;
    }
  }

  handleAudioEnded() {
    this.props.playPauseAudio('pause')();
    this.stupidWorkaround();
  }

  handleCanPlay() {
    this.props.receivePlaybackState({
      audioDuration: this.audioPlayer.audioEl.duration
    });
  }

  handleListen() {
    const timelineWidth = this.timeline.getBoundingClientRect().width;
    const playheadWidth = this.playhead.getBoundingClientRect().width;
    const playFraction = this.audioPlayer.audioEl.currentTime / this.props.audioDuration;
    this.playhead.style.marginLeft = (timelineWidth - playheadWidth) * playFraction + "px";
    this.props.receivePlaybackState({
      audioCurrentTime: this.audioPlayer.audioEl.currentTime
    });
  }

  handleClickTimeline(e) {
    const timelineLeft = this.timeline.getBoundingClientRect().left;
    const timelineWidth = this.timeline.getBoundingClientRect().width;
    const playheadWidth = this.playhead.getBoundingClientRect().width;
    const clickFraction = (e.clientX - timelineLeft) / timelineWidth;
    this.audioPlayer.audioEl.currentTime = this.props.audioDuration * clickFraction;
    this.playhead.style.marginLeft = (timelineWidth - playheadWidth) * clickFraction + "px";
    this.props.receivePlaybackState({
      audioCurrentTime: this.props.audioDuration * clickFraction
    });
    this.stupidWorkaround();
  }

  stupidWorkaround() {
    // stupid workaround for currentTime & seekbar not updating
    setTimeout((function() { this.collectionPlayButton.click(); }).bind(this), 500);
    setTimeout((function() { this.collectionPlayButton.click(); }).bind(this), 500);
  }

  render() {
    if (this.props.sound === null) {
      return (
        <div id='collection-sound-player' className='collection-sound-player' />
      );
    }
    const audioPlayer = (
      <ReactAudioPlayer
        key={ this.props.sound.id }
        id='audio-player'
        src={ this.props.sound.audioUrl }
        onEnded={ this.handleAudioEnded }
        onCanPlay={ this.handleCanPlay }
        listenInterval={ 100 }
        onListen={ this.handleListen }
        ref={c => this.audioPlayer = c }
      />
    );
    let titleTruncated;
    if (this.props.sound.title.length < 29) {
      titleTruncated = this.props.sound.title;
    } else {
      titleTruncated = this.props.sound.title.slice(0, 26) + '...';
    }
    let collectionPlayButton;
    if (this.props.playing) {
      collectionPlayButton = (
        <button id='explore-play-button' className='collection-playing' onClick={ this.props.playPauseAudio('pause') } ref={c => this.collectionPlayButton = c } />
      );
    } else {
      collectionPlayButton = (
        <button id='explore-play-button' className='collection-paused' onClick={ this.props.playPauseAudio('play') } ref={c => this.collectionPlayButton = c } />
      );
    }
    return (
      <div key={ this.props.sound.id }  id='collection-sound-player' className='collection-sound-player'>
        { audioPlayer }
        { collectionPlayButton }
        <div className='explore-sound-player-right'>
          <div className='explore-sound-player-details'>
            <p className='explore-sound-player-title'>{ titleTruncated }</p>
            <p className='explore-sound-player-time'>{ `${this.toHHMMSS(this.props.audioCurrentTime)} / ${this.toHHMMSS(this.props.audioDuration)}` }</p>
          </div>
          <div id='collection-timeline' className='collection-sound-player-timeline' onClick={ this.handleClickTimeline } ref={c => this.timeline = c } >
            <div id='collection-playhead' className='collection-sound-player-playhead' ref={c => this.playhead = c } />
          </div>
        </div>
      </div>
    );
  }
}

export default ExploreSoundPlayer;
