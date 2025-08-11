import { useState } from 'react'
import './MoodSongs.css'

const MoodSongs = ({ Songs }) => {

    const [ isPlaying, setIsPlaying ] = useState(null);

    const handlePlayPause = (index) => {
        if (isPlaying === index) {
            setIsPlaying(null);
        } else {
            setIsPlaying(index);
        }
    };


    return (
        <div className="mood-songs">
            <hr />
            <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: "2rem", letterSpacing: "0.02em" }}>
                <span role="img" aria-label="music">🎵</span> Recommended Songs
            </h2>
            {Songs.length === 0 ? (
                <div style={{ textAlign: "center", color: "#bbb", fontSize: "1.1rem", marginTop: "2rem" }}>
                    <i className="ri-emotion-sad-line" style={{ fontSize: "2rem", marginBottom: "0.5rem", display: "block" }}></i>
                    No recommendations yet. Try detecting your mood!
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {Songs.map((song, index) => (
                        <div
                            className="song"
                            key={index}
                            style={{
                                background: isPlaying === index ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.04)",
                                borderRadius: "1rem",
                                padding: "1.2rem 1.5rem",
                                alignItems: "center",
                                boxShadow: isPlaying === index ? "0 2px 12px rgba(37,99,235,0.10)" : "none",
                                transition: "background 0.2s, box-shadow 0.2s"
                            }}
                        >
                            <div className="title" style={{ flex: 1 }}>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: "1.2rem",
                                    fontWeight: 600,
                                    color: isPlaying === index ? "#60a5fa" : "#fff"
                                }}>
                                    {song.title}
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: "1rem",
                                    color: "#b3b3b3",
                                    fontWeight: 400
                                }}>
                                    {song.artist}
                                </p>
                            </div>
                            <div className="play-pause-button" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {isPlaying === index && (
                                    <audio
                                        src={song.audio}
                                        style={{ display: "none" }}
                                        autoPlay
                                        onEnded={() => setIsPlaying(null)}
                                    />
                                )}
                                <button
                                    onClick={() => handlePlayPause(index)}
                                    style={{
                                        background: isPlaying === index ? "#2563eb" : "#23272f",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "2.8rem",
                                        height: "2.8rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.6rem",
                                        boxShadow: isPlaying === index ? "0 2px 8px #2563eb44" : "none",
                                        cursor: "pointer",
                                        transition: "background 0.2s, box-shadow 0.2s"
                                    }}
                                    aria-label={isPlaying === index ? "Pause" : "Play"}
                                >
                                    {isPlaying === index ? (
                                        <i className="ri-pause-line"></i>
                                    ) : (
                                        <i className="ri-play-circle-fill"></i>
                                    )}
                                </button>
                                <a
                                    href={song.audio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#60a5fa",
                                        textDecoration: "none",
                                        fontSize: "1.1rem",
                                        marginLeft: "0.5rem",
                                        opacity: 0.8
                                    }}
                                    title="Open in new tab"
                                >
                                    <i className="ri-external-link-line"></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MoodSongs