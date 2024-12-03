import GlobalTopSongs from "./GlobalTopSongs";  
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from "react"; 


function App() {
  const topTracks = window.topTracks || []; 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [topTracks, setTopTracks] = useState([]);  // State for top tracks
  const [isLoading, setIsLoading] = useState(true);  // State for loading

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');

    if (token) {
      localStorage.setItem('spotify_access_token', token);
      window.location.href = '/'; // Clear the URL and reload the app
    } else {
      const storedToken = localStorage.getItem('spotify_access_token');
      if (storedToken) {
        setIsLoggedIn(true);
      } else {
        window.location.href = "http://localhost:5001/login";
      }
    }
    setIsLoading(false);
  }, 
  []);
  
  return (
    <div className="App">
      <header className="App-header">
        <p>Today's Spotify Analytics</p>
      </header>
      
      <div className="green-box-container">
        <div className="green-box"><h3>Top Songs</h3></div>
        <div className="green-box"><h3>Monthly Listeners</h3></div>
        <div className="green-box"><h3>Featured Playlists</h3></div>
        <div className="green-box"><h3>Top Albums</h3></div>
        <div className="green-box"><h3>Similar Artists</h3></div>
        <div className="green-box"><h3>Featured On</h3></div>
      </div>
    </div>
  );
}
export default App;

