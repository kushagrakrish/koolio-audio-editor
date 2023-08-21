// import React, { useContext, useEffect, useState } from "react";
// import AudioEditor from "../components/AudioEditor";
// import { FileContext } from "../context/FileContext";
// import { getAllAudioFiles, initializeIndexedDB } from "../IndexedDB";

// const EditAudio = () => {
//   const { fileURL } = useContext(FileContext);
//   const [audioUrl, setAudioUrl] = useState(null);

//   useEffect(() => {
//     initializeIndexedDB()
//       .then((db) => getAllAudioFiles(db))
//       .then((audioFiles) => {
//         if (audioFiles.length > 0) {
//           setAudioUrl(
//             URL.createObjectURL(
//               new Blob([audioFiles[audioFiles.length - 1].data])
//             )
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Failed to initialize IndexedDB:", error);
//       });
//   }, []);

//   return (
//     <>
//       <h1 className='text-4xl text-purple-800 font-bold m-auto w-full text-center mt-10'>
//         Edit Your Audio File
//       </h1>
//       <AudioEditor
//         height={100}
//         waveColor='rgb(200, 0, 200)'
//         progressColor='rgb(100, 0, 100)'
//         url={fileURL || audioUrl}
//       />
//     </>
//   );
// };

// export default EditAudio;

import Timeline from "https://unpkg.com/wavesurfer.js@7/dist/plugins/timeline.esm.js";
import React, { useContext, useEffect, useState } from "react";
import { getAllAudioFiles, initializeIndexedDB } from "../IndexedDB";
import AudioEditor from "../components/AudioEditor";
import { FileContext } from "../context/FileContext";

const EditAudio = () => {
  const { fileURL, setFileURL } = useContext(FileContext);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState([]); // Add this state

  useEffect(() => {
    initializeIndexedDB()
      .then((db) => getAllAudioFiles(db))
      .then((audioFiles) => {
        setUploadedAudioFiles(audioFiles); // Store the list of audio files
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
        plugins={[Timeline.create()]}
      />

      {/* <div className='mt-4'>
        <h2 className='text-xl font-semibold mb-2'>Uploaded Audio Files:</h2>
        <ul>
          {uploadedAudioFiles.map((audio, index) => (
            <li
              key={index}
              onClick={() => handleAudioFileClick(audio.data)} // Handle click
              className='cursor-pointer text-blue-500'
            >
              {audio.name}
            </li>
          ))}
        </ul>
      </div> */}
    </>
  );
};

export default EditAudio;
