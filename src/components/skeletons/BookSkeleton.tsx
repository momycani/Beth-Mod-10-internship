import React from "react";
import "../../styles/skeleton.css";

export default function BookSkeleton() {
  return (
    <section className="mt90 sm-mt-0">
      <div className="container">
        <div className="book-layout">

          {/* LEFT SIDE */}
          <div className="book-layout__left">
            <div className="skeleton sk-book-title" />
            <div className="skeleton sk-book-author" />
            <div className="skeleton sk-book-subtitle" />

            <div className="book-divider" />

            <div className="sk-book-stats">
              <div className="skeleton sk-stat" />
              <div className="skeleton sk-stat" />
              <div className="skeleton sk-stat" />
              <div className="skeleton sk-stat" />
            </div>

            <div className="book-divider" />

            <div className="skeleton sk-book-btn" />
            <div className="skeleton sk-book-btn secondary" />

            <div className="skeleton sk-book-library" />

            <div className="skeleton sk-book-paragraph" />
            <div className="skeleton sk-book-paragraph" />
          </div>

          {/* RIGHT SIDE */}
          <div className="book-layout__right">
            <div className="skeleton sk-book-image" />
          </div>

        </div>
      </div>
    </section>
  );
}