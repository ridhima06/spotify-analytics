const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
const cors = require('cors'); 
//const SpotifyWebApi = require('../../');
//const express = require('../../node_modules/express');

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:3000' }));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5001/callback',
});

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
    try {
      const data = await spotifyApi.refreshAccessToken();
      const newAccessToken = data.body['access_token'];
      spotifyApi.setAccessToken(newAccessToken);
      console.log('Access token refreshed:', newAccessToken);
  
      // Optionally, store the new access token in memory or a database
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };



app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });


let topTracks = []; 
app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(`Successfully retrieved access token. Expires in ${expires_in} s.`);

      return spotifyApi.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB');
    })
    .then(function (data) {
      console.log('Fetched top tracks:', data.body.tracks);

      topTracks = data.body.tracks.map(track => ({
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', '),
      }));

      console.log('Mapped top tracks:', topTracks);

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8"/>
          <link rel="icon" href="/spotify-analytics/favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="theme-color" content="#000000"/>
          <meta name="description" content="Web site created using create-react-app"/>
          <link rel="apple-touch-icon" href="/spotify-analytics/logo192.png"/>
          <link rel="manifest" href="/spotify-analytics/manifest.json"/>
          <link href="https://fonts.googleapis.com/css2?family=Circular+Std:wght@400;600&display=swap" rel="stylesheet"/>
          <title>React App</title>
  
          <!-- Embed the topTracks data as a global JS variable -->
          <script>
            window.topTracks = ${JSON.stringify(topTracks)};
          </script>
  
          <!-- React App Script -->
          <script defer="defer" src="/spotify-analytics/static/js/main.ab906c07.js"></script>
          <link href="/spotify-analytics/static/css/main.d328a64c.css" rel="stylesheet"/>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
        </body>
        </html>
      `);
    })
    .catch(function (err) {
      console.log('Error fetching tracks:', err);

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8"/>
          <link rel="icon" href="/spotify-analytics/favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="theme-color" content="#000000"/>
          <meta name="description" content="Web site created using create-react-app"/>
          <link rel="apple-touch-icon" href="/spotify-analytics/logo192.png"/>
          <link rel="manifest" href="/spotify-analytics/manifest.json"/>
          <link href="https://fonts.googleapis.com/css2?family=Circular+Std:wght@400;600&display=swap" rel="stylesheet"/>
          <title>React App</title>
  
          <!-- Embed an empty array in case of an error -->
          <script>
            window.topTracks = [];
          </script>
  
          <!-- React App Script -->
          <script defer="defer" src="/spotify-analytics/static/js/main.ab906c07.js"></script>
          <link href="/spotify-analytics/static/css/main.d328a64c.css" rel="stylesheet"/>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
        </body>
        </html>
      `);
    });
});

  app.listen(5001, () => {
    console.log('Server is running on http://localhost:5001');
  });