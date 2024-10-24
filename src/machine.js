import { createMachine } from 'xstate';

const machine = createMachine(
  {
    id: 'player',
    initial: 'mini',
    context: {
      videoRef: null,
    },
    states: {
      mini: {
        on: {
          toggle: 'full',
          PLAY: 'playing',
          RESIZE: {
            actions: 'resizeVideo',
            target: 'full',
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
        },
      },
      paused: {
        exit: 'pauseVideo',
        on: {
          PLAY: 'playing',
          RESIZE: {
            actions: 'resizeVideo',
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
    },
  }
);

export default machine;
