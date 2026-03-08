// src/pages/Player.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiReplay10Fill, RiPlayFill, RiPauseFill, RiForward10Fill } from "react-icons/ri";
import "../styles/player.css";
import PlayerSkeleton from "../components/skeletons/PlayerSkeleton";
import { auth } from "../firebase";
import { markBookFinished, updateBookProgress, addBookToLibrary } from "../utils/library";
import { formatDuration } from "../utils/formatDuration";

const BOOK_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";



export default function Player({
  onRequireLogin,
}: {
  onRequireLogin: () => void;
}) {
  const isGuest = localStorage.getItem("isGuest") === "true";

  const currentUser = auth.currentUser;
  const isPremium = currentUser
    ? localStorage.getItem(`isPremium:${currentUser.uid}`) === "true"
    : false;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

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
    if (!id) return;

    if (isGuest) {
      localStorage.setItem("postAuthRedirect", `/player/${id}`);
      onRequireLogin();
    }
  }, [id, isGuest, onRequireLogin]);

  useEffect(() => {
    if (!book || !id) return;

    if (book.subscriptionRequired && !isPremium) {
      navigate("/choose-plan", {
        replace: true,
        state: {
          from: `/player/${id}`,
          bookId: id,
        },
      });
    }
  }, [book, id, isPremium, navigate]);

  const handleAudioEnded = async () => {
    const user = auth.currentUser;

    setIsPlaying(false);
    setCurrent(0);

    if (!user || !book?.id) return;

    try {
      await addBookToLibrary(user.uid, {
        bookId: String(book.id),
        title: book.title,
        author: book.author,
        imageLink: book.imageLink,
        subscriptionRequired: book.subscriptionRequired,
      });

      await markBookFinished(user.uid, String(book.id));
    } catch (err) {
      console.error("Failed to mark book finished:", err);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !book?.id) return;

    const onTimeUpdateProgress = async () => {
      const user = auth.currentUser;
      if (!user || !audio.duration) return;

      const progress = Math.round((audio.currentTime / audio.duration) * 100);
      await updateBookProgress(user.uid, String(book.id), progress);
    };

    audio.addEventListener("timeupdate", onTimeUpdateProgress);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdateProgress);
    };
  }, [book]);

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
      console.error(err);
    }
  };

  const seekBy = (secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(
      0,
      Math.min(duration || 0, audio.currentTime + secs)
    );
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
        onEnded={handleAudioEnded}
      />

      <main className="player-main">
        <div className="player-content">
          <h1 className="player-title">
            {book?.title ?? (loading ? "Loading..." : "Untitled")}
          </h1>

          <div className="player-divider" />

          <article className="player-summary">
            {book?.summary ? (
              book.summary.split(/\n+/).map((paragraph:string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))
            ) : loading ? (
              <p>Loading summary…</p>
            ) : (
              <p>{book?.summary ?? "No summary available."}</p>
            )}
          </article>
        </div>
      </main>

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
         <div className="player-time">{formatDuration(current)}</div>

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
            onMouseUp={(e) =>
              onSeekEnd(Number((e.target as HTMLInputElement).value))
            }
            onTouchEnd={(e) =>
              onSeekEnd(Number((e.target as HTMLInputElement).value))
            }
            aria-label="Seek"
            style={{
              background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                duration ? (current / duration) * 100 : 0
              }%, rgba(255,255,255,0.18) ${
                duration ? (current / duration) * 100 : 0
              }%, rgba(255,255,255,0.18) 100%)`,
            }}
          />

         <div className="player-time">{formatDuration(duration || book?.duration)}</div>
        </div>
      </footer>
    </div>
  );
}
