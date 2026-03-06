// src/pages/Player.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RiReplay10Fill, RiPlayFill, RiPauseFill, RiForward10Fill } from "react-icons/ri";
import "../styles/player.css";
import PlayerSkeleton from "../components/skeletons/PlayerSkeleton";

const BOOK_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Player.tsx

export default function Player({
  onRequireLogin,
}: {
  onRequireLogin: () => void;
}) {

  const isGuest = localStorage.getItem("isGuest") === "true";

  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0); // seconds
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  
// fetch book (contains audioLink)
  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BOOK_URL}?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!alive) return;
        setBook(data);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setBook(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
  setCurrent(0);
  setDuration(0);
  setIsPlaying(false);
}, [book?.audioLink]);

  useEffect(() => {
    if (isGuest) {
      localStorage.setItem("postAuthRedirect", `/player/${id}`);
      onRequireLogin();
    }
  }, [isGuest, onRequireLogin]);



  // play / pause toggling
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      // autoplay blocked or other
      console.error(err);
    }
  };

  const seekBy = (secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min((duration || 0), audio.currentTime + secs));
    setCurrent(audio.currentTime);
  };

  const onSeekStart = () => setSeeking(true);
  const onSeekEnd = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrent(value);
    setSeeking(false);
  };

  if (loading) {
  return <PlayerSkeleton />;
}

  return (
    <div className="player-page">
      {/* hidden audio element */}
      <audio
        ref={audioRef}
        src={book?.audioLink ?? ""}
        preload="metadata"
        onLoadedMetadata={(e) => {
    setDuration(e.currentTarget.duration || 0);
  }}
  onTimeUpdate={(e) => {
    if (!seeking) {
      setCurrent(e.currentTarget.currentTime);
    }
  }}
  onEnded={() => {
    setIsPlaying(false);
    setCurrent(0);
  }}
      />

      {/* MAIN CONTENT (centered reading column) */}
      <main className="player-main">
        <div className="player-content">
          <h1 className="player-title">{book?.title ?? (loading ? "Loading..." : "Untitled")}</h1>
          <div className="player-divider" />

          <article className="player-summary">
            {book?.summary ? (
              <p>{book.summary}</p>
            ) : loading ? (
              <p>Loading summary…</p>
            ) : (
              <p>{book?.bookDescription ?? "No summary available."}</p>
            )}
          </article>
        </div>
      </main>

      {/* BOTTOM FIXED PLAYER BAR */}
      <footer className="player-bar" role="region" aria-label="Audio player">
        <div className="player-bar__left">
          <img
            className="player-bar__cover"
            src={book?.imageLink ?? ""}
            alt={book?.title ? `${book.title} cover` : "Book cover"}
          />
          <div className="player-bar__meta">
            <div className="player-bar__bookTitle">{book?.title}</div>
            <div className="player-bar__author">{book?.author}</div>
          </div>
        </div>

        <div className="player-bar__center">
          <button
            className="player-btn player-btn--small"
            aria-label="Rewind 10 seconds"
            onClick={() => seekBy(-10)}
            type="button"
          >
            <RiReplay10Fill size={28} />
          </button>

          <button
            className="player-btn player-btn--play"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
            type="button"
          >
            {isPlaying ? <RiPauseFill size={28} /> : <RiPlayFill size={28} />}
          </button>

          <button
            className="player-btn player-btn--small"
            aria-label="Forward 10 seconds"
            onClick={() => seekBy(10)}
            type="button"
          >
            <RiForward10Fill size={28} />
          </button>
        </div>

        <div className="player-bar__right">
          <div className="player-time">{formatTime(current)}</div>

          <input
            className="player-slider"
            type="range"
            min={0}
            max={Math.ceil(duration || 0)}
            step={1}
            value={Math.round(current)}
            onMouseDown={onSeekStart}
            onTouchStart={onSeekStart}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrent(val);
            }}
            onMouseUp={(e) => onSeekEnd(Number((e.target as HTMLInputElement).value))}
            onTouchEnd={(e) => onSeekEnd(Number((e.target as HTMLInputElement).value))}
            aria-label="Seek"
            style={{
              background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                duration ? (current / duration) * 100 : 0
              }%, rgba(255,255,255,0.18) ${
                duration ? (current / duration) * 100 : 0
              }%, rgba(255,255,255,0.18) 100%)`,
            }}
          />

          <div className="player-time">{formatTime(duration)}</div>
        </div>
      </footer>
    </div>
  );
}