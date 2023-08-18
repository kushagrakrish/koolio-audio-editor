// import React, { useContext, useEffect, useRef, useState } from "react";
// import { FileContext } from "../context/FileContext";
// import { useNavigate } from "react-router-dom";
// import {
//   addAudioFile,
//   initializeIndexedDB,
//   getAllAudioFiles,
// } from "../IndexedDB";

// const UploadAudio = () => {
//   const navigate = useNavigate();
//   const inputAudioFile = useRef();
//   const { setFileURL } = useContext(FileContext);
//   const [audioFileNames, setAudioFileNames] = useState([]);

//   useEffect(() => {
//     // Fetch audio file names from IndexedDB
//     initializeIndexedDB()
//       .then((db) => getAllAudioFiles(db))
//       .then((audioFiles) => {
//         const names = audioFiles.map((audio) => audio.name);
//         setAudioFileNames(names);
//       })
//       .catch((error) => {
//         console.error(
//           "Failed to fetch audio file names from IndexedDB:",
//           error
//         );
//       });
//   }, []);

//   const handleFileUpload = async (e) => {
//     try {
//       const audioBlob = await e.target.files[0].arrayBuffer();
//       const audioName = e.target.files[0].name; // Get the name of the audio file
//       initializeIndexedDB()
//         .then((db) => addAudioFile(db, audioBlob, audioName)) // Pass the name as well
//         .then(() => {
//           setFileURL(URL.createObjectURL(new Blob([audioBlob])));
//           navigate("/edit");
//         })
//         .catch((error) => {
//           console.error("Failed to add audio file to IndexedDB:", error);
//         });
//     } catch (error) {
//       console.error("Error reading audio file:", error);
//     }
//   };

//   return (
//     <>
//       <div className='flex items-center justify-center w-full flex-col'>
//         <h1 className='text-4xl text-purple-800 font-semibold'>
//           Upload your Audio
//         </h1>
//         <input
//           type='file'
//           onChange={handleFileUpload}
//           id='file'
//           ref={inputAudioFile}
//           style={{ display: "none" }}
//           accept='audio/*'
//         />
//         <button
//           onClick={() => inputAudioFile.current.click()}
//           className='upload-btn mt-10 transition-all ease-in delay-75'
//         >
//           Upload
//         </button>
//         <div className='mt-4'>
//           <h2 className='text-lg font-semibold'>Uploaded Audio Files:</h2>
//           <ul>
//             {audioFileNames.map((name, index) => (
//               <li key={index}>{name}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UploadAudio;

import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState([]);

  useEffect(() => {
    initializeIndexedDB()
      .then((db) => getAllAudioFiles(db))
      .then((audioFiles) => {
        setUploadedAudioFiles(audioFiles); // Store the list of audio files
      })
      .catch((error) => {
        console.error("Failed to initialize IndexedDB:", error);
      });
  }, []);

  const handleFileUpload = async (e) => {
    try {
      const audioBlob = await e.target.files[0].arrayBuffer();
      const audioName = e.target.files[0].name; // Get the name of the uploaded file
      initializeIndexedDB()
        .then((db) => addAudioFile(db, audioBlob, audioName)) // Pass the audio name
        .then(() => {
          setFileURL(URL.createObjectURL(new Blob([audioBlob])));
          navigate("/edit"); // Navigate to the edit page
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

        {/* Display uploaded audio files */}
        <div className='mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Uploaded Audio Files:</h2>
          <ul>
            {uploadedAudioFiles.map((audio, index) => (
              <li
                key={index}
                onClick={() => {
                  // Handle navigation here
                  // You can set the selected audio file URL and then navigate
                  // Remember to update the below line according to your code structure
                  setFileURL(URL.createObjectURL(new Blob([audio.data])));
                  navigate("/edit");
                }}
                className='cursor-pointer text-blue-500'
              >
                {audio.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default UploadAudio;
