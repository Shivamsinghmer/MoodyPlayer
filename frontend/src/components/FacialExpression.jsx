import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./facialExpression.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function FacialExpression({ setSongs }) {
  const videoRef = useRef();
  const [loading, setLoading] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [error, setError] = useState(null);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        setError("Unable to access webcam.");
        console.error("Error accessing webcam: ", err);
      });
  };

  async function detectMood() {
    setLoading(true);
    setError(null);
    setDetectedMood(null);
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        setError("No face detected. Please ensure your face is visible.");
        setLoading(false);
        return;
      }

      let mostProbableExpression = 0;
      let _expression = "";

      for (const expression of Object.keys(detections[0].expressions)) {
        if (detections[0].expressions[expression] > mostProbableExpression) {
          mostProbableExpression = detections[0].expressions[expression];
          _expression = expression;
        }
      }

      setDetectedMood(_expression);

      // get <API_BASE_URL>/songs?mood=happy
      const response = await axios.get(
        `${API_BASE_URL}/songs?mood=${_expression}`
      );
      setSongs(response.data.songs);
    } catch (err) {
      setError("An error occurred during mood detection.");
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  // Mood emoji mapping
  const moodEmojis = {
    happy: "😄",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
    disgusted: "🤢",
    fearful: "😨",
    neutral: "😐",
  };

  return (
    <div className="moodify-root">
      {/* Navbar */}
      <nav className="moodify-navbar">
        <div className="moodify-navbar-title">
          <span role="img" aria-label="music" className="moodify-logo">🎶</span>
          <span>Moodify</span>
        </div>
        <a
          href="https://github.com/Shivamsinghmer/MoodyPlayer"
          target="_blank"
          rel="noopener noreferrer"
          className="moodify-navbar-btn"
        >
          <i className="ri-github-fill"></i>
          GitHub
        </a>
      </nav>

      {/* Main Content */}
      <div className="moodify-main-content">
        {/* Left: Video Screen */}
        <div className="moodify-video-section">
          <div className="moodify-video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="moodify-user-video"
            />
            {/* Overlay mood result */}
            {detectedMood && (
              <div className="moodify-mood-overlay">
                <span className="moodify-mood-emoji">
                  {moodEmojis[detectedMood] || "🙂"}
                </span>
                <span className="moodify-mood-label">
                  {detectedMood}
                </span>
              </div>
            )}
            {/* Loading spinner */}
            {loading && (
              <div className="moodify-loader-overlay">
                <div className="moodify-loader" />
              </div>
            )}
            {/* Error message */}
            {error && (
              <div className="moodify-error-message">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}
          </div>
        </div>
        {/* Right: Info and Button */}
        <div className="moodify-info-section">
          <h3 className="moodify-info-title">
            <i className="ri-emotion-happy-line"></i>
            Live Mood Detection
          </h3>
          <p className="moodify-info-desc">
            Instantly analyze your facial expressions to detect your current mood in real time.
            <br />
            Click the button below to start mood detection and get personalized song recommendations!
          </p>
          <button
            className="moodify-detect-btn"
            onClick={detectMood}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line moodify-btn-spinner"></i>
                Detecting...
              </>
            ) : (
              <>
                <i className="ri-search-eye-line"></i>
                Detect Mood
              </>
            )}
          </button>
          {error && (
            <div className="moodify-error-message moodify-error-message-below">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}
        </div>
        
      </div>
      {/* Styles */}
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-light: #60a5fa;
          --bg-dark: #232526;
          --bg-darker: #181c23;
          --bg-panel: rgba(36,41,47,0.92);
          --navbar-bg: rgba(30,41,59,0.92);
          --error: #f87171;
          --error-bg: rgba(220,38,38,0.12);
        }
        .moodify-root {
          width: 100vw;
          box-sizing: border-box;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .moodify-navbar {
          margin: 1rem auto 0 auto;
          box-shadow: 0 2px 12px #0002;
          width: 90%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0.75rem;
        }
        .moodify-navbar-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.01em;
        }
        .moodify-logo {
          font-size: 1.5rem;
        }
        .moodify-navbar-btn {
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          color: #fff;
          padding: 0.4rem;
          border-radius: 0.6rem;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          box-shadow: 0 2px 8px #2563eb33;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          border: none;
          gap: 0.6rem;
        }
        .moodify-navbar-btn:hover {
          background: linear-gradient(90deg, #1d4ed8 0%, var(--primary-light) 100%);
        }
        .moodify-main-content {
          margin: 2.5rem auto 2rem auto;
          max-width: 1000px;
          border-radius: 1.5rem;
          background: var(--bg-panel);
          box-shadow: 0 4px 32px #0003;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: row;
          gap: 2.5rem;
          width: 95%;
        }
        @media (max-width: 900px) {
          .moodify-main-content {
            flex-direction: column;
            gap: 2rem;
            padding: 1.5rem 0.5rem;
          }
          .moodify-info-section {
            padding-left: 0 !important;
            margin-top: 1rem;
          }
        }
        .moodify-video-section {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 1rem;
        }
        .moodify-video-container {
          border-radius: 1.2rem;
          overflow: hidden;
          border: 2.5px solid var(--primary);
          box-shadow: 0 4px 24px #2563eb22;
          width: 100%;
          max-width: 32rem;
          background: var(--bg-darker);
          position: relative;
          min-height: 15rem;
        }
        .moodify-user-video {
          background: #222;
          width: 100%;
          aspect-ratio: 16/9;
          min-height: 15rem;
          object-fit: cover;
          border-radius: 1.2rem;
          display: block;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .moodify-mood-overlay {
          position: absolute;
          bottom: 1.2rem;
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-panel);
          border-radius: 2rem;
          padding: 0.6rem 1.5rem;
          color: #fff;
          font-weight: 600;
          font-size: 1.25rem;
          box-shadow: 0 2px 8px #2563eb33;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          border: 1.5px solid var(--primary);
          z-index: 2;
          letter-spacing: 0.01em;
          min-width: 8rem;
          justify-content: center;
          backdrop-filter: blur(2px);
        }
        .moodify-mood-emoji {
          font-size: 1rem;
          background : transparent;
        }
        .moodify-mood-label {
          text-transform: capitalize;
          background : transparent;
          font-size: 1.15rem;
          letter-spacing: 0.01em;
        }
        .moodify-loader-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          border-radius: 50%;
          padding: 1.2rem;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .moodify-loader {
          border: 5px solid #2563eb44;
          border-top: 5px solid var(--primary);
          border-radius: 50%;
          width: 1rem;
          height: 1rem;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .moodify-error-message {
          color: var(--error);
          background: var(--error-bg);
          border: 1.5px solid var(--error);
          border-radius: 0.7rem;
          padding: 0.7rem 1.2rem;
          margin-top: 1.2rem;
          font-weight: 500;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          position: absolute;
          left: 50%;
          bottom: 0.5rem;
          transform: translateX(-50%);
          z-index: 4;
          min-width: 60%;
          max-width: 90%;
          box-sizing: border-box;
        }
        .moodify-error-message-below {
          position: static;
          margin-top: 1.2rem;
          min-width: unset;
          max-width: unset;
          left: unset;
          bottom: unset;
          transform: unset;
        }
        .moodify-info-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding-left: 2rem;
          min-width: 0;
        }
        .moodify-info-title {
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 0.7rem;
          color: var(--primary-light);
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .moodify-info-title i {
          font-size: 1.7rem;
          color: var(--primary);
        }
        .moodify-info-desc {
          margin-bottom: 1.2rem;
          color: #cbd5e1;
          font-size: 1.08rem;
          line-height: 1.6;
          max-width: 32rem;
        }
        .moodify-detect-btn {
          margin-top: 0.5rem;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          color: #fff;
          padding: 0.85rem 2.2rem;
          border: none;
          border-radius: 0.7rem;
          font-size: 1.08rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px #2563eb33;
          transition: background 0.2s, opacity 0.2s;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          outline: none;
        }
        .moodify-detect-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .moodify-detect-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #1d4ed8 0%, var(--primary-light) 100%);
        }
        .moodify-btn-spinner {
          margin-right: 0.7rem;
          animation: spin 1s linear infinite;
        }
        @media (max-width: 600px) {
          .moodify-navbar {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 0.7rem;
          }
          .moodify-main-content {
            padding: 1rem 0.2rem;
          }
          .moodify-info-section {
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
