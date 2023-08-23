import audioSong from "../components/new.wav";
import PlaylistEditor from "../components/PlaylistEditor";
import React, { useCallback, useState, useRef, useEffect } from "react";
import EventEmitter from "events";
import WaveformPlaylist from "waveform-playlist";
import { saveAs } from "file-saver";
import { Tone } from "tone/build/esm/core/Tone";

const PlaylistEditorPage = () => {
  const audio = audioSong;
  const [ee] = useState(new EventEmitter());
  const [toneCtx, setToneCtx] = useState(null);
  const setUpChain = useRef();
  const container = useCallback(
    (node) => {
      if (node !== null && toneCtx !== null) {
        const playlist = WaveformPlaylist(
          {
            ac: toneCtx.rawContext,
            samplesPerPixel: 100,
            mono: true,
            waveHeight: 100,
            container: node,
            state: "cursor",
            colors: {
              waveOutlineColor: "#E0EFF1",
              timeColor: "grey",
              fadeColor: "black",
            },
            controls: {
              show: true,
              width: 150,
            },
            zoomLevels: [100, 300, 500],
          },
          ee
        );

        ee.on("audiorenderingstarting", function (offlineCtx, a) {
          // Set Tone offline to render effects properly.
          const offlineContext = new Tone.OfflineContext(offlineCtx);
          Tone.setContext(offlineContext);
          setUpChain.current = a;
        });

        ee.on("audiorenderingfinished", function (type, data) {
          // Restore original ctx for further use.
          Tone.setContext(toneCtx);
          if (type === "wav") {
            saveAs(data, "test.wav");
          }
        });

        playlist.load([
          {
            src: audio,
            name: "Hello",
            effects: function (graphEnd, masterGainNode, isOffline) {
              const reverb = new Tone.Reverb(1.2);

              if (isOffline) {
                setUpChain.current.push(reverb.ready);
              }

              Tone.connect(graphEnd, reverb);
              Tone.connect(reverb, masterGainNode);

              return function cleanup() {
                reverb.disconnect();
                reverb.dispose();
              };
            },
          },
        ]);

        // Initialize the WAV exporter.
        playlist.initExporter();
      }
    },
    [ee, toneCtx]
  );

  return (
    <div className='App'>
      <h1 className='text-center text-2xl font-bold mb-10'>Audio Editor</h1>
      <PlaylistEditor audioUrl={audio} />
    </div>
  );
};

export default PlaylistEditorPage;
