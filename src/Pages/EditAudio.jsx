import React, { useContext, useEffect, useState } from "react";
import AudioEditor from "../components/AudioEditor";
import { FileContext } from "../context/FileContext";
import { getAllAudioFiles, initializeIndexedDB } from "../IndexedDB";

const EditAudio = () => {
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
    <>
      <h1 className='text-4xl text-purple-800 font-bold m-auto w-full text-center mt-10'>
        Edit Your Audio File
      </h1>
      <AudioEditor
        height={100}
        waveColor='rgb(200, 0, 200)'
        progressColor='rgb(100, 0, 100)'
        url={fileURL || audioUrl}
      />
    </>
  );
};

export default EditAudio;
