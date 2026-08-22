import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function LearningVideo() {
  const videoRef = useRef(null);
  const subtitleRef = useRef(null);

  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const track = video.textTracks[0];
    if (!track) return;

    track.mode = "hidden"; // Disable default subtitles

    track.oncuechange = () => {
      const cue = track.activeCues[0];
      let text = cue ? cue.text : "";

      // Clean YouTube-style caption format (remove <v speaker> metadata)
      text = text.replace(/<v[^>]*>/gi, "").replace(/<\/v>/gi, "").trim();

      setCurrentText(text);
    };
  }, []);

  // ------- Draggable Subtitle Logic -------
  useEffect(() => {
    const el = subtitleRef.current;
    if (!el) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
      dragging = true;
      el.style.cursor = "grabbing";
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
    };

    const onMouseMove = (e) => {
      if (!dragging) return;
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
      dragging = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [currentText]);

  // --------- Fullscreen Responsive Position -------
  useEffect(() => {
    const handleFullscreen = () => {
      const el = subtitleRef.current;
      if (!el) return;

      if (document.fullscreenElement) {
        el.style.position = "fixed";
        el.style.bottom = "40px";
      } else {
        el.style.position = "absolute";
        el.style.bottom = "20px";
      }

      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎬 ML Pipeline Training Video</h2>
      <p>Watch before starting the assessment.</p>

      <div style={{ position: "relative", display: "inline-block" }}>
        <video ref={videoRef} width="70%" controls style={{ borderRadius: "10px" }}>
          <source src="/ml_pipeline.mp4" type="video/mp4" />
          <track src="/ml_subtitles.vtt" kind="subtitles" label="English" />
        </video>

        {currentText && (
          <div
            ref={subtitleRef}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.65)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "20px",
              color: "white",
              maxWidth: "85%",
              textAlign: "center",
              cursor: "grab",
              userSelect: "none",
              lineHeight: "1.4",
              whiteSpace: "normal",  // 🔥 Fixes the extra subtitle box bug
              display: "inline-flex", // 🔥 Makes subtitle size tight like YouTube
              textShadow: "0px 0px 6px black", // Optional: enhances readability
            }}
          >
            {currentText}
          </div>
        )}
      </div>

      <br /><br />

      <Link to="/quiz">
        <button style={{ padding: "12px 22px", fontSize: "18px", cursor: "pointer" }}>
            Start Quiz
        </button>
      </Link>
    </div>
  );
}
