const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
// console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET);
// console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);


// Spotify API setup
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    // clientId: '62288024f1e24b40ad6b89f0e1dc6a5c',
    // clientSecret: '15cc8a8a89434a69bc43bcb990860194',
    // redirectUri: 'http://localhost:5001/callback'
});

// Step 1: Login URL
app.get('/login', (req, res) => {
    const scopes = ['user-read-private', 'user-read-email']; // Add scopes as needed
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

// Step 2: Callback and Token Exchange
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token, expires_in } = data.body;

        // Set tokens
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        res.send('Logged in! Tokens have been set.');
    } catch (error) {
        console.error('Error exchanging code:', error);
        res.status(500).send('Error logging in to Spotify');
    }
});

// Step 3: Example API Request
app.get('/me', async (req, res) => {
    try {
        const me = await spotifyApi.getMe();
        res.json(me.body);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Error fetching user data');
    }
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        res.send('Logged in! Tokens have been set.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during authentication');
    }
});

app.get('/me', async (req, res) => {
    try {
        const me = await spotifyApi.getMe();
        res.json(me.body);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching user data');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
