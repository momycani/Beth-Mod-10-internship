import React from "react";
import "../../styles/player.css";

export default function PlayerSkeleton() {
  return (
    <div className="player-page">
      {/* MAIN CONTENT */}
      <main className="player-main">
        <div className="player-content">
          <div className="sk sk-title" />
          <div className="player-divider" />

          <article className="player-summary">
            <div className="sk sk-line" />
            <div className="sk sk-line" />
            <div className="sk sk-line" />
            <div className="sk sk-line short" />
          </article>
        </div>
      </main>

      {/* BOTTOM FIXED PLAYER BAR */}
      <footer className="player-bar" role="region" aria-label="Audio player">
        <div className="player-bar__left">
          <div className="sk sk-cover" />
          <div className="player-bar__meta">
            <div className="sk sk-metaTitle" />
            <div className="sk sk-metaAuthor" />
          </div>
        </div>

        <div className="player-bar__center">
          <div className="sk sk-btn small" />
          <div className="sk sk-btn play" />
          <div className="sk sk-btn small" />
        </div>

        <div className="player-bar__right">
          <div className="sk sk-time" />
          <div className="sk sk-slider" />
          <div className="sk sk-time" />
        </div>
      </footer>
    </div>
  );
}