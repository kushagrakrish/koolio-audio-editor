import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWavesurfer } from "./waveHooks";

const AudioEditor = (props) => {
  const containerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(100); // Initialize zoom level to 100%
  const [wavesurfer, wavesurferObj] = useWavesurfer(containerRef, props); // Use the hook's return values

  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionClick = useCallback((region) => {
    setSelectedRegion(region);
  }, []);

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
      wavesurferObj.on("region-updated", handleRegionClick), // Change this line
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
      wavesurferObj.un("region-updated", handleRegionClick); //
    };
  }, [wavesurfer, wavesurferObj, handleRegionClick]);

  // Update the zoom level when the slider changes
  const handleZoomSlider = (e) => {
    const minPxPerSec = e.target.value;
    setZoom(wavesurfer.zoom(minPxPerSec));
  };

  const handleForward = () => {
    wavesurfer.skip(5);
  };

  const handleBackward = () => {
    wavesurfer.skip(-5);
  };

  const handleTrim = () => {
    if (wavesurferObj && wavesurferObj.regions) {
      const regions = wavesurferObj.regions.list;
      const regionKeys = Object.keys(regions);

      if (regionKeys.length > 0) {
        const selectedRegion = regions[regionKeys[0]];
        const start = selectedRegion.start;
        const end = selectedRegion.end;

        // Get the original audio buffer
        const originalBuffer = wavesurferObj.backend.buffer;

        // Calculate the new buffer length after trimming
        const newBufferLength =
          originalBuffer.length - (end - start) * originalBuffer.sampleRate;

        // Create a new audio buffer to hold the trimmed audio
        const newBuffer = wavesurferObj.backend.ac.createBuffer(
          originalBuffer.numberOfChannels,
          newBufferLength,
          originalBuffer.sampleRate
        );

        // Copy audio data from original buffer to new buffer, excluding the selected region
        for (
          let channel = 0;
          channel < originalBuffer.numberOfChannels;
          channel++
        ) {
          const originalData = originalBuffer.getChannelData(channel);
          const newData = newBuffer.getChannelData(channel);

          // Copy data before the selected region
          const startIdx = Math.floor(start * originalBuffer.sampleRate);
          newData.set(originalData.subarray(0, startIdx), 0);

          // Copy data after the selected region
          const endIdx = Math.floor(end * originalBuffer.sampleRate);
          newData.set(originalData.subarray(endIdx), startIdx);
        }

        // Load the new buffer into wavesurferObj
        wavesurferObj.loadDecodedBuffer(newBuffer);

        // Remove the selected region from the waveform
        selectedRegion.remove();
      }
    }
  };

  useEffect(() => {
    if (wavesurferObj) {
      // Listen for region updates
      wavesurferObj.on("region-updated", (region) => {
        setSelectedRegion(region);
      });
    }
  }, [wavesurferObj]);

  return (
    <div>
      <div ref={containerRef} style={{ minHeight: "120px" }} />
      <p className='text-lg font-bold text-center mt-5'>
        Seconds played: {currentTime.toFixed(2)}
      </p>
      <button
        className='text-xl bg-purple-800 px-5 py-2 text-white mx-auto flex items-center justify-center mt-20'
        onClick={onPlayClick}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

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
      <div className='flex flex-col items-center justify-center gap-4'>
        <button
          onClick={handleForward}
          className='bg-purple-800 p-3 text-white text-lg'
        >
          Forward 5s
        </button>
        <button
          onClick={handleBackward}
          className='bg-purple-800 p-3 text-white text-lg'
        >
          Backward 5s
        </button>
        <button
          className='bg-purple-800 p-3 text-white text-lg'
          onClick={handleTrim}
        >
          Trim
        </button>
      </div>
    </div>
  );
};

export default AudioEditor;
