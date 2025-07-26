import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useRef, useEffect } from 'react';

function Video({ src }) {
  const videoRef = useRef();

  useEffect(() => {
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [
        {
          src,
          type: 'video/mp4',
        },
      ],
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="video-js vjs-default-skin"
      style={{ width: '100%', height: '500px' }}
      controls
    />
  );
}

export default Video;
