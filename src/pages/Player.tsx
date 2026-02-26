import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/player.css";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaPlay, FaPause } from "react-icons/fa";
import { RiReplay10Fill, RiForward10Fill } from "react-icons/ri";

const BOOK_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

export default function Player() {
  // later we’ll wire this to actually change the article font-size
  const [fontStep, setFontStep] = useState<1 | 2 | 3>(2);

  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await fetch(`${BOOK_URL}?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      setBook(data);
    })();
  }, [id]);

  return (
    <div className="player-page">
      {/* MAIN CONTENT */}
      <main className="player-main">
        <div className="player-content">
          <h1 className="player-title">{book?.title}</h1>

          <div className="player-divider" />

          <article className={`player-summary player-summary--fs-${fontStep}`}>
            {book?.summary ? <p>{book.summary}</p> : <p>Loading summary...</p>}
          </article>
        </div>
      </main>

      {/* BOTTOM AUDIO BAR */}
      <footer className="player-bar">
        {/* Left: book mini */}
        <div className="player-bar__left">
          <img
            className="player-bar__cover"
            src={book?.imageLink || ""}
            alt={book?.title || "Book cover"}
          />
          <div className="player-bar__meta">
            <div className="player-bar__bookTitle">{book?.title ?? ""}</div>
            <div className="player-bar__author">{book?.author ?? ""}</div>
          </div>
        </div>

        {/* Center: controls */}
        <div className="player-bar__center">
          <button className="player-btn" aria-label="Back 10 seconds" type="button">
            <RiReplay10Fill />
            <span className="player-btn__text"></span>
          </button>

          <button
            className="player-btn player-btn--play"
            aria-label="Play"
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button className="player-btn" aria-label="Forward 10 seconds" type="button">
            <span className="player-btn__text"></span>
            <RiForward10Fill />
          </button>
        </div>

        {/* Right: time / slider */}
        <div className="player-bar__right">
          <div className="player-time">00:00</div>
          <input className="player-slider" type="range" min={0} max={100} value={0} readOnly />
          <div className="player-time">03:24</div>
        </div>
      </footer>

      {/* Sidebar font controls (this lives visually in your sidebar area) */}
      <div className="player-fontControls">
        <button
          type="button"
          className="player-fontBtn"
          aria-label="Decrease font size"
          onClick={() => setFontStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)))}
        >
      
        </button>

        <button
          type="button"
          className="player-fontBtn"
          aria-label="Increase font size"
          onClick={() => setFontStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)))}
        >
      
        </button>
      </div>
    </div>
  );
}