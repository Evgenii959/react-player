import { createMachine, assign } from 'xstate';

const machine = createMachine(
  {
    id: 'player',
    initial: 'modalClosed',
    context: {
      videoRef: null,
      isModalVisible: false,
    },
    states: {
      modalClosed: {
        on: {
          OPEN_MODAL: {
            target: 'mini',
            actions: assign({ isModalVisible: true }),
          },
        },
      },
      mini: {
        on: {
          toggle: 'full',
          PLAY: 'playing',
          RESIZE: {
            actions: 'resizeVideo',
            target: 'full',
          },
          CLOSE_MODAL: {
            target: 'modalClosed',
            actions: assign({ isModalVisible: false }),
          },
        },
      },
      full: {
        entry: 'playVideo',
        exit: 'pauseVideo',
        on: {
          toggle: 'mini',
          PAUSE: 'paused',
          PLAY: 'playing',
          RESIZE: {
            actions: 'resizeVideo',
            target: 'mini',
          },
          CLOSE_MODAL: {
            target: 'modalClosed',
            actions: assign({ isModalVisible: false }),
          },
        },
      },
      playing: {
        entry: 'playVideo',
        on: {
          PAUSE: 'paused',
          END: 'mini',
          RESIZE: {
            actions: 'resizeVideo',
          },
          CLOSE_MODAL: {
            target: 'modalClosed',
            actions: assign({ isModalVisible: false }),
          },
        },
      },
      paused: {
        exit: 'pauseVideo',
        on: {
          PLAY: 'playing',
          RESIZE: {
            actions: 'resizeVideo',
          },
          CLOSE_MODAL: {
            target: 'modalClosed',
            actions: assign({ isModalVisible: false }),
          },
        },
      },
    },
  },
  {
    actions: {
      playVideo: (context) => {
        if (context.videoRef?.current) {
          context.videoRef.current.getInternalPlayer().play();
        }
      },
      pauseVideo: (context) => {
        if (context.videoRef?.current) {
          context.videoRef.current.getInternalPlayer().pause();
        }
      },
      resizeVideo: () => console.log('Video resized'),
    },
  }
);

export default machine;
