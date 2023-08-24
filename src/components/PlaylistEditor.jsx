import React, { useEffect, useRef, useState } from "react";
import WaveformPlaylist from "waveform-playlist";
import EventEmitter from "wavesurfer.js/dist/event-emitter";

const PlaylistEditor = ({ audioUrl }) => {
  const playlistRef = useRef(null);
  let playlistInstance = null; // Store the playlist instance for reference

  let isDragging = false;
  let selectionStart = 5;
  let selectionEnd = 13;

  useEffect(() => {
    if (audioUrl) {
      playlistInstance = WaveformPlaylist({
        container: playlistRef.current,
        samplesPerPixel: 3000,
        mono: true,
        waveHeight: 70,
        state: "cursor",
        seekStyle: "fill",
        colors: {
          waveOutlineColor: "pink",
          timeColor: "white",
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
            customClass: "vocals",
            fadeIn: {
              duration: 5,
            },
            fadeOut: {
              shape: "logarithmic",
              duration: 10,
            },
            selected: {
              // start time of selection in seconds, relative to the playlist
              start: selectionStart,

              // end time of selection in seconds, relative to the playlist
              end: selectionEnd,
            },
          },
        ])
        .then(() => {
          const ee = playlistInstance.getEventEmitter();
          console.log(ee.emit("select"));
          console.log(playlistInstance.getTimeSelection());
          console.log(playlistInstance);
          // Enable user-driven region selection
          ee.on("select", (start, end, track) => {
            // Do something with start and end times (e.g., store in state)
            // setName(!name);
            console.log("Selected region:", start, end, track);
          });

          ee.on("mousedown", (e) => {
            console.log(e);
            if (e.target.tagName === "CANVAS") {
              isDragging = true;
              selectionStart = playlistInstance.getCurrentTime();
              // Update the UI to indicate drag selection start...
              console.log(selectionStart);
            }
          });

          ee.on("mousemove", (e) => {
            if (isDragging) {
              selectionEnd = playlistInstance.getCurrentTime();
              // Update the UI to highlight the selected region...
              console.log(selectionEnd);
            }
          });

          ee.on("mouseup", () => {
            if (isDragging) {
              isDragging = false;
              // Update the UI to remove the selected region highlight...
              // Perform actions based on selectionStart and selectionEnd...
            }
          });

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
              ee.emit("trim", (2, 10));
            });
        });
    }
  }, [audioUrl]);

  return (
    <div>
      <div id='CANVAS' ref={playlistRef}></div>
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
