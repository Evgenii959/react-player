import { useState, useRef, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Modal, Button } from 'antd';
import ReactPlayer from 'react-player';
import machine from './machine';

const App = () => {
  const videoRef = useRef(null);
  const [state, send] = useMachine(machine, {
    context: {
      videoRef,
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoWidth, setVideoWidth] = useState('452px');
  const [videoHeight, setVideoHeight] = useState('254px');

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handlePlayPause = () => {
    send({ type: state.matches('playing') ? 'PAUSE' : 'PLAY' });
  };

  const handleResize = () => {
    if (videoWidth === '452px') {
      setVideoWidth('1000px');
      setVideoHeight('700px');
      send({ type: 'RESIZE' });
    } else {
      setVideoWidth('452px');
      setVideoHeight('254px');
      send({ type: 'RESIZE' });
    }
  };

  const handleEnded = () => {
    send({ type: 'END' });
    setTimeout(() => {
      send({ type: 'PLAY' });
    }, 100);
  };

  useEffect(() => {
    if (isModalVisible) {
      send({ type: 'PLAY' });
    } else {
      send({ type: 'PAUSE' });
    }
  }, [isModalVisible, send]);

  useEffect(() => {
    console.log('Current state:', state.value);
  }, [state]);

  return (
    <div>
      <Button
        type="primary"
        onClick={openModal}
      >
        Open Video Player
      </Button>

      <Modal
        title="PLAYER"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          send({ type: 'PAUSE' });
        }}
        footer={null}
        width={videoWidth}
        height={videoHeight}
      >
        <ReactPlayer
          ref={videoRef}
          url="https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8"
          playing={state.matches('playing')}
          muted={true}
          width="100%"
          height="100%"
          onEnded={handleEnded}
        />
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button onClick={handleResize}>
            {videoWidth === '452px'
              ? 'Expand Video'
              : 'Shrink Video'}
          </Button>
          <Button onClick={handlePlayPause}>
            {state.matches('playing') ? 'Pause' : 'Play'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
