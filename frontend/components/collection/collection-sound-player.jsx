import React from 'react';

class CollectionSoundPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioCurrentTime: 0,
      audioDuration: 0
    };
  }

  componentDidMount() {
    const soundAudio = document.getElementById('sound-audio');
    soundAudio.addEventListener('ended', () => {
      collectionPlayButton.classList.remove('collection-playing');
      collectionPlayButton.classList.add('collection-paused');
    });
    soundAudio.addEventListener('loadeddata', (() => {
      this.setState({
        audioDuration: soundAudio.duration
      });
    }).bind(this));
    soundAudio.addEventListener('timeupdate', (() => {
      const playhead = document.getElementById('collection-playhead');
      let playPercent = 100 * (soundAudio.currentTime / this.state.audioDuration);
      playhead.style.marginLeft = playPercent + "%";
      this.setState({
        audioCurrentTime: soundAudio.currentTime
      });
    }).bind(this), false);
    const timeline = document.getElementById('collection-timeline');
    timeline.addEventListener('click', ((e) => {
      const left = timeline.getBoundingClientRect().left;
      const width = timeline.getBoundingClientRect().width;
      const clickFraction = (e.clientX - left) / width;
      soundAudio.currentTime = soundAudio.duration * clickFraction;
    }).bind(this), false);
  }

  componentWillReceiveProps(newProps) {
    const soundAudio = document.getElementById('sound-audio');
    soundAudio.currentTime = 0;
    this.setState({
      audioCurrentTime: 0
    });
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

  playAudio() {
    const soundAudio = document.getElementById('sound-audio');
    const collectionPlayButton = document.getElementById('collection-play-button');
    if (soundAudio.paused) {
      soundAudio.play();
      collectionPlayButton.classList.remove('collection-paused');
      collectionPlayButton.classList.add('collection-playing');
    } else {
      soundAudio.pause();
      collectionPlayButton.classList.remove('collection-playing');
      collectionPlayButton.classList.add('collection-paused');
    }
  }

  render() {
    const soundAudio = (
      <audio id='sound-audio' >
        <source src={ this.props.sound.audioUrl } type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
    return (
      <div key={ this.props.sound.id }  id='collection-sound-player' className='collection-sound-player'>
        { soundAudio }
        <button id='collection-play-button' className='collection-paused' onClick={ this.playAudio } ></button>
        <div className='collection-sound-player-right'>
          <div className='collection-sound-player-details'>
            <p>{ this.props.sound.title }</p>
            <p>{ this.toHHMMSS(this.state.audioCurrentTime) }</p>
            <p>{ this.toHHMMSS(this.state.audioDuration) }</p>
          </div>
          <div id='collection-timeline' className='collection-sound-player-timeline'>
            <div id='collection-playhead' className='collection-sound-player-playhead' />
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionSoundPlayer;