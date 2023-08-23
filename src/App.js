import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { initializeIndexedDB } from "./IndexedDB";
import EditAudio from "./Pages/EditAudio";
import Home from "./Pages/Home";
import PlaylistEditorPage from "./Pages/PlaylistEditorPage";
import Navbar from "./components/Navbar";

const App = () => {
  useEffect(() => {
    initializeIndexedDB().catch((error) => {
      console.error("Failed to initialize IndexedDB:", error);
    });
  }, []);
  console.log(2 + 2);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/edit' element={<EditAudio />} />
        <Route path='/editor' element={<PlaylistEditorPage />} />
      </Routes>
    </>
  );
};

export default App;
