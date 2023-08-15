import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWavesurfer } from "./waveHooks";

const AudioEditor = (props) => {
  const containerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const wavesurfer = useWavesurfer(containerRef, props);

  // On play button click
  const onPlayClick = useCallback(() => {
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
  }, [wavesurfer]);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;

    setCurrentTime(0);
    setIsPlaying(false);

    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on("timeupdate", (currentTime) => setCurrentTime(currentTime)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  return (
    <div>
      <div ref={containerRef} style={{ minHeight: "120px" }} />

      <button
        className='text-xl bg-purple-800 px-5 py-2 text-white mx-auto flex items-center justify-center mt-20'
        onClick={onPlayClick}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <p className='text-lg font-bold text-center mt-5'>
        Seconds played: {currentTime}
      </p>
    </div>
  );
};

export default AudioEditor;
