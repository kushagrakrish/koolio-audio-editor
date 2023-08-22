import React, { useEffect, useRef, useState } from "react";
import WaveformPlaylist from "waveform-playlist";

const PlaylistEditor = ({ audioUrl }) => {
  const [playlist, setPlaylist] = useState(null);
  const playlistRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const playlistInstance = WaveformPlaylist({
      container: playlistRef.current,
      state: "cursor",
      samplesPerPixel: 3000,
      mono: true,
      duration: true,
      colors: {
        waveOutlineColor: "purple",
        timeColor: "white",
        fadeColor: "red",
      },
      controls: {
        show: true,
        width: 200,
      },

      seekStyle: "line",
      zoomLevels: [500, 1000, 3000, 5000],
      isAutomaticScroll: true,
      timescale: true, // Show time scale
    });

    playlistInstance.load([
      {
        src: audioUrl,
        name: "Audio",
        fadeIn: {
          duration: 5,
        },
        fadeOut: {
          shape: "logarithmic",
          duration: 10,
        },
      },
    ]);

    playlistInstance.initExporter();

    playlistInstance.sink?.on("timeupdate", () => {
      // Update the current time whenever time changes
      setCurrentTime(playlistInstance.state.getTime());
    });

    setPlaylist(playlistInstance);
  }, [audioUrl]);

  // useEffect(() => {
  //   if (playlist && playlist.waveform && playlist.waveform.peaks) {
  //     const sampleRate = playlist.sampleRate;
  //     const peaks = playlist.waveform.peaks[0]; // Assumes mono audio
  //     const totalSamples = peaks.length;
  //     const totalDurationInSeconds = totalSamples / sampleRate;
  //     setTotalDuration(totalDurationInSeconds);
  //   }
  // }, [playlist]);

  const handlePlay = () => {
    if (playlist) {
      playlist.play();
    }
  };

  const handlePause = () => {
    if (playlist) {
      playlist.pause();
    }
  };

  return (
    <div>
      <div className='flex flex-col gap-5' ref={playlistRef}></div>
      <div className='flex gap-5 mt-5'>
        <button
          className='bg-purple-800 p-3 text-white text-lg'
          onClick={handlePlay}
        >
          Play
        </button>
        <button
          className='bg-purple-800 p-3 text-white text-lg'
          onClick={handlePause}
        >
          Pause
        </button>
      </div>
      <div className='mt-2 text-white'>
        <p>Current Time: {currentTime.toFixed(2)}</p>
        <p>Total Duration: {totalDuration.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PlaylistEditor;
