import React, { useContext, useEffect, useRef } from "react";
import { FileContext } from "../context/FileContext";
import { useNavigate } from "react-router-dom";
import {
  addAudioFile,
  initializeIndexedDB,
  getAllAudioFiles,
} from "../IndexedDB";

const UploadAudio = () => {
  const navigate = useNavigate();
  const inputAudioFile = useRef();
  const { setFileURL } = useContext(FileContext);

  useEffect(() => {
    initializeIndexedDB().catch((error) => {
      console.error("Failed to initialize IndexedDB:", error);
    });
  }, []);

  const handleFileUpload = async (e) => {
    try {
      const audioBlob = await e.target.files[0].arrayBuffer();
      initializeIndexedDB()
        .then((db) => addAudioFile(db, audioBlob))
        .then(() => {
          setFileURL(URL.createObjectURL(new Blob([audioBlob])));
          navigate("/edit");
        })
        .catch((error) => {
          console.error("Failed to add audio file to IndexedDB:", error);
        });
    } catch (error) {
      console.error("Error reading audio file:", error);
    }
  };

  return (
    <>
      <div className='flex items-center justify-center w-full flex-col'>
        <h1 className='text-4xl text-purple-800 font-semibold'>
          Upload your Audio
        </h1>
        <input
          type='file'
          onChange={handleFileUpload}
          id='file'
          ref={inputAudioFile}
          style={{ display: "none" }}
          accept='audio/*'
        />
        <button
          onClick={() => inputAudioFile.current.click()}
          className='upload-btn mt-10 transition-all ease-in delay-75'
        >
          Upload
        </button>
      </div>
    </>
  );
};

export default UploadAudio;
