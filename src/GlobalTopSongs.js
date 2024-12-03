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
        // If access token is expired, refresh the token
        if (err.response && err.response.status === 401) {
        //   try {
        //     const refreshResponse = await axios.get('http://localhost:5001/refresh-token');
        //     const newAccessToken = refreshResponse.data.access_token;

        //     // Store the new token in localStorage
        //     localStorage.setItem('spotify_access_token', newAccessToken);

        //     // Retry the original request with the new token
        //     const retryResponse = await axios.get("http://localhost:5001/global-top-tracks", {
        //       headers: {
        //         Authorization: `Bearer ${newAccessToken}`,
        //       },
        //     });
        try {
            const refreshResponse = await axios.get('http://localhost:5001/refresh-token', {
              params: { refresh_token: refreshToken }, // Send refresh token as a query parameter
            });
            const newAccessToken = refreshResponse.data.access_token;
    
            // Store the new access token in localStorage
            localStorage.setItem('spotify_access_token', newAccessToken);
    
            // Retry the original request with the new token
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
  }, [token, refreshToken]);  // Add refreshToken as a dependency, though it's unlikely to change often

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


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const GlobalTopSongs = () => {
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const SPOTIFY_API = "https://api.spotify.com/v1";
//   const token = localStorage.getItem("spotify_access_token"); // Retrieve token from localStorage

//   useEffect(() => {
//     const fetchGlobalHits = async () => {
//       try {
//         const playlistsResponse = await axios.get(
//           `${SPOTIFY_API}/browse/featured-playlists`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const globalTopPlaylist = playlistsResponse.data.playlists.items.find(
//           (playlist) => playlist.name.toLowerCase().includes("global")
//         );

//         if (!globalTopPlaylist) {
//           setError("No global trending playlist found");
//           setLoading(false);
//           return;
//         }

//         const tracksResponse = await axios.get(
//           `${SPOTIFY_API}/playlists/${globalTopPlaylist.id}/tracks`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         // Limit to top 5 songs
//         setSongs(tracksResponse.data.items.slice(0, 5));
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching global hits:", err);
//         setError("Failed to fetch global hits");
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchGlobalHits();
//     } else {
//       setError("Access token is required");
//       setLoading(false);
//     }
//   }, [token]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <ul>
//         {songs.map((item, index) => (
//           <li key={index}>
//             {item.track.name} by {item.track.artists.map((artist) => artist.name).join(", ")}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default GlobalTopSongs;
