import React, { useContext, useEffect, useState } from "react";
import PlaylistEditor from "../components/PlaylistEditor";
import audioSong from "../components/new.wav";
import { FileContext } from "../context/FileContext";
import { getAllAudioFiles, initializeIndexedDB } from "../IndexedDB";

const PlaylistEditorPage = () => {
  const audio = audioSong;
  const { fileURL } = useContext(FileContext);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    initializeIndexedDB()
      .then((db) => getAllAudioFiles(db))
      .then((audioFiles) => {
        if (audioFiles.length > 0) {
          setAudioUrl(
            URL.createObjectURL(
              new Blob([audioFiles[audioFiles.length - 1].data])
            )
          );
        }
      })
      .catch((error) => {
        console.error("Failed to initialize IndexedDB:", error);
      });
  }, []);

  return (
    <div className='App'>
      <h1 className='text-center text-2xl font-bold mb-10'>Audio Editor</h1>
      <PlaylistEditor audioUrl={fileURL || audioUrl} />
    </div>
  );
};

export default PlaylistEditorPage;
