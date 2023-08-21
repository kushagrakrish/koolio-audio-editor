import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js";
import EnvelopePlugin from "https://unpkg.com/wavesurfer.js@7/dist/plugins/envelope.esm.js";

// WaveSurfer hook
export const useWavesurfer = (containerRef, options, wsRegions) => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [wavesurferObj, setWavesurferObj] = useState(null); // Add this state

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });
    const envelope = ws.registerPlugin(
      EnvelopePlugin.create({
        fadeInEnd: 5,
        fadeOutStart: 15,
        volume: 0.8,
        lineColor: "rgba(255, 0, 0, 0.5)",
        lineWidth: 4,
        dragPointSize: 8,
        dragPointFill: "rgba(0, 255, 255, 0.8)",
        dragPointStroke: "rgba(0, 0, 0, 0.5)",
      })
    );
    const wsRegions = ws.registerPlugin(RegionsPlugin.create());

    // Give regions a random color when they are created
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomColor = () =>
      `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
    // Create some regions at specific time ranges
    ws.on("decode", () => {
      // Regions
      wsRegions.addRegion({
        start: 0,
        end: 8,
        content: "Resize me",
        color: randomColor(),
        drag: false,
        resize: true,
      });
      wsRegions.addRegion({
        start: 9,
        end: 10,
        content: "Cramped region",
        color: randomColor(),
        minLength: 1,
        maxLength: 10,
      });
      wsRegions.addRegion({
        start: 12,
        end: 17,
        content: "Drag me",
        color: randomColor(),
        resize: false,
      });

      // Markers (zero-length regions)
      wsRegions.addRegion({
        start: 19,
        content: "Marker",
        color: randomColor(),
      });
      wsRegions.addRegion({
        start: 20,
        content: "Second marker",
        color: randomColor(),
      });
    });

    wsRegions.enableDragSelection({
      color: "rgba(255, 0, 0, 0.1)",
    });

    wsRegions.on("region-updated", (region) => {
      console.log("Updated region", region);
    });

    let loop = true;
    {
      let activeRegion = null;
      wsRegions.on("region-in", (region) => {
        activeRegion = region;
      });
      wsRegions.on("region-out", (region) => {
        if (activeRegion === region) {
          if (loop) {
            region.play();
          } else {
            activeRegion = null;
          }
        }
      });
      wsRegions.on("region-clicked", (region, e) => {
        e.stopPropagation(); // prevent triggering a click on the waveform
        activeRegion = region;
        region.play();
        region.setOptions({ color: randomColor() });
      });
      // Reset the active region when the user clicks anywhere in the waveform
      ws.on("interaction", () => {
        activeRegion = null;
      });
    }

    setWavesurfer(ws);
    setWavesurferObj(wsRegions); // Set the wavesurferObj state
    setWavesurferObj(envelope);
    return () => {
      ws.destroy();
    };
  }, [options, containerRef, wsRegions]);

  return [wavesurfer, wavesurferObj]; // Return both states
};
