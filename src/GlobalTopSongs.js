import React, { useEffect, useState } from "react";
import axios from "axios";

const GlobalTopSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("spotify_access_token");
  const refreshToken = localStorage.getItem("spotify_refresh_token");  // Assuming you store refresh token as well

  useEffect(() => {
    const fetchGlobalHits = async () => {
      if (!token) {
        setError("Access token is required.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/global-top-tracks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSongs(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
        
        try {
            const refreshResponse = await axios.get('http://localhost:5001/refresh-token', {
              params: { refresh_token: refreshToken }, // Send refresh token as a query parameter
            });
            const newAccessToken = refreshResponse.data.access_token;
    
            localStorage.setItem('spotify_access_token', newAccessToken);
    
            const retryResponse = await axios.get("http://localhost:5001/global-top-tracks", {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            setSongs(retryResponse.data);
            setLoading(false);
          } catch (refreshErr) {
            console.error("Error refreshing token:", refreshErr);
            setError("Failed to refresh access token");
            setLoading(false);
          }
        } else {
          console.error("Error fetching global hits:", err);
          setError("Failed to fetch global hits");
          setLoading(false);
        }
      }
    };

    fetchGlobalHits();
  }, [token, refreshToken]);  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Global Top Songs</h2>
      <ul>
        {songs.map((item, index) => (
          <li key={index}>
            {item.track.name} by {item.track.artists.map((artist) => artist.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlobalTopSongs;