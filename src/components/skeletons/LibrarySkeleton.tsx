import React from "react";
import "../../styles/library.css";

type LibrarySkeletonProps = {
  count?: number;
};

function SkeletonCard() {
  return (
    <div className="library-card library-card--skeleton" aria-hidden="true">
      <div className="library-card__imgWrapper library-skeleton library-skeleton--image" />

      <div className="library-skeleton library-skeleton--title" />
      <div className="library-skeleton library-skeleton--author" />
      <div className="library-skeleton library-skeleton--subtitle" />

      <div className="library-meta">
        <span className="library-skeleton library-skeleton--meta" />
        <span className="library-skeleton library-skeleton--meta" />
      </div>
    </div>
  );
}

export default function LibrarySkeleton({
  count = 4,
}: LibrarySkeletonProps) {
  return (
    <div className="library-page">
      <section className="library-section">
        <div className="library-skeleton library-skeleton--sectionTitle" />
        <div className="library-skeleton library-skeleton--sectionCount" />

        <div className="library-grid">
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>

      <section className="library-section">
        <div className="library-skeleton library-skeleton--sectionTitle" />
        <div className="library-skeleton library-skeleton--sectionCount" />

        <div className="library-grid">
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={`finished-${index}`} />
          ))}
        </div>
      </section>
    </div>
  );
}