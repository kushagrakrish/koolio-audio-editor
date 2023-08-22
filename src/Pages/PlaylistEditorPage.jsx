import React from "react";
import audioSong from "../components/new.wav";
import PlaylistEditor from "../components/PlaylistEditor";

const PlaylistEditorPage = () => {
  const audio = audioSong;

  return (
    <div className='App'>
      <h1>Audio Editor</h1>
      <PlaylistEditor audioUrl={audio} />
    </div>
  );
};

export default PlaylistEditorPage;
