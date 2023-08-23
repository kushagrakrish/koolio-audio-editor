import React from "react";
import { Route, Routes } from "react-router-dom";
import EditAudio from "./Pages/EditAudio";
import Home from "./Pages/Home";
import PlaylistEditorPage from "./Pages/PlaylistEditorPage";
import Navbar from "./components/Navbar";

const App = () => {
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
