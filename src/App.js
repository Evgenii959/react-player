import { useRef } from 'react';
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

  const openModal = () => {
    send({ type: 'OPEN_MODAL' });
    setTimeout(() => {
      send({ type: 'PLAY' });
    }, 100);
  };

  const closeModal = () => {
    send({ type: 'CLOSE_MODAL' });
  };

  const handlePlayPause = () => {
    send({ type: state.matches('playing') ? 'PAUSE' : 'PLAY' });
  };

  const handleResize = () => {
    send({ type: 'RESIZE' });
  };

  const handleEnded = () => {
    send({ type: 'END' });
    setTimeout(() => {
      send({ type: 'PLAY' });
    }, 100);
  };

  return (
    <div>
      <Button type="primary" onClick={openModal}>
        Open Video Player
      </Button>

      <Modal
        title="PLAYER"
        open={state.context.isModalVisible}
        onCancel={closeModal}
        footer={null}
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
            {state.matches('mini') ? 'Expand Video' : 'Shrink Video'}
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
