import React, { useEffect, useRef } from "react";
import WaveformPlaylist from "waveform-playlist";

const PlaylistEditor = ({ audioUrl }) => {
  const playlistRef = useRef(null);
  let playlistInstance = null; // Store the playlist instance for reference

  useEffect(() => {
    if (audioUrl) {
      playlistInstance = WaveformPlaylist({
        container: playlistRef.current,
        samplesPerPixel: 3000,
        mono: true,
        waveHeight: 70,
        state: "cursor",
        colors: {
          waveOutlineColor: "pink",
          timeColor: "red",
          fadeColor: "green",
        },
        controls: {
          show: true,
          width: 150,
        },
        zoomLevels: [500, 1000, 3000, 5000],
      });

      playlistInstance
        .load([
          {
            name: "new",
            src: audioUrl,
            fadeIn: {
              duration: 5,
            },
            fadeOut: {
              shape: "logarithmic",
              duration: 10,
            },
            selected: {
              start: 0,
              end: 5,
            },
          },
        ])
        .then(() => {
          const ee = playlistInstance.getEventEmitter();

          document
            .getElementById("btn-play")
            .addEventListener("click", function () {
              ee.emit("play");
            });

          document
            .getElementById("btn-pause")
            .addEventListener("click", function () {
              ee.emit("pause");
            });

          document
            .getElementById("btn-trim")
            .addEventListener("click", function () {
              const currentTime = playlistInstance.getCurrentTime();
              const selectedRegion = {
                start: 14, // Adjust these values based on your needs
                end: 17,
              };

              // Get the underlying AudioBuffer for the track
              const audioBuffer = playlistInstance.tracks[0].buffer;

              // Create a new AudioContext
              const audioContext = new AudioContext();

              // Create a new AudioBuffer with the trimmed audio data
              const duration = selectedRegion.end - selectedRegion.start;
              const startFrame = Math.floor(
                selectedRegion.start * audioBuffer.sampleRate
              );
              const endFrame = Math.floor(
                selectedRegion.end * audioBuffer.sampleRate
              );
              const frameCount = endFrame - startFrame;
              const channels = audioBuffer.numberOfChannels;
              const trimmedBuffer = audioContext.createBuffer(
                channels,
                frameCount,
                audioBuffer.sampleRate
              );

              for (let channel = 0; channel < channels; channel++) {
                const sourceChannel = audioBuffer.getChannelData(channel);
                const targetChannel = trimmedBuffer.getChannelData(channel);

                for (let frame = 0; frame < frameCount; frame++) {
                  targetChannel[frame] = sourceChannel[startFrame + frame];
                }
              }

              // Create a new AudioBufferSourceNode
              const source = audioContext.createBufferSource();
              source.buffer = trimmedBuffer;

              // Connect the source to the destination (e.g., speakers)
              source.connect(audioContext.destination);

              // Start playing the trimmed audio
              source.start();
            });
        });
    }
  }, [audioUrl]);

  return (
    <div>
      <div ref={playlistRef}></div>
      <div>
        <button
          className='bg-purple-800 p-4 text-lg text-white'
          type='button'
          id='btn-play'
          title='Play'
        >
          <i className='fas fa-play'></i>
          Play
        </button>
        <button
          className='bg-purple-800 p-4 text-lg text-white'
          type='button'
          id='btn-pause'
          title='Pause'
        >
          <i className='fas fa-pause'></i>
          Pause
        </button>
        <button
          className='bg-purple-800 p-4 text-lg text-white'
          type='button'
          id='btn-trim'
          title='Trim'
        >
          Trim
        </button>
      </div>
    </div>
  );
};

export default PlaylistEditor;
