import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("access_token");

    if (token) {
      localStorage.setItem("spotify_access_token", token);
      navigate("/"); // Redirect to the main page
    } else {
      console.error("No access token found");
    }
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default Callback;
