import React, { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useWavesurfer } from "./waveHooks";

const AudioEditor = (props) => {
  const containerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(100); // Initialize zoom level to 100%
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
      wavesurfer.on("zoom", (minPxPerSec) => setZoom(minPxPerSec)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  // Update the zoom level when the slider changes
  const handleZoomSlider = (e) => {
    // const newZoom = parseInt(e.target.value);
    // setZoom(newZoom);
    // wavesurfer.zoom(newZoom / 100);
    const minPxPerSec = e.target.value;
    // wavesurfer.zoom(minPxPerSec);
    setZoom(wavesurfer.zoom(minPxPerSec));
  };

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
        Seconds played: {currentTime.toFixed(2)}
      </p>
      <div>
        <label>
          Zoom:{" "}
          <input
            type='range'
            min='10'
            max='1000'
            value={zoom}
            onChange={handleZoomSlider}
          />
        </label>
      </div>
    </div>
  );
};

export default AudioEditor;
