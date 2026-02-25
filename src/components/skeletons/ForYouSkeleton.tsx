import React from "react";

export default function ForYouSkeleton() {
  return (
    <div className="fy-page">
      {/* Selected just for you */}
      <section className="selected">
        <h2 className="selected__title">Selected just for you</h2>
        <div className="selected__card selected__card--skeleton" />
      </section>

      {/* Recommended */}
      <section className="fy-carousel">
        <div className="fy-carousel__header">
          <h2 className="fy-carousel__title">Recommended For You</h2>
          <p className="fy-carousel__subtitle">We think you&apos;ll like these</p>
        </div>

        <div className="fy-carousel__skeletonRow">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="fy-card fy-card--skeleton" />
          ))}
        </div>
      </section>

      {/* Suggested */}
      <section className="fy-carousel">
        <div className="fy-carousel__header">
          <h2 className="fy-carousel__title">Suggested Books</h2>
        </div>

        <div className="fy-carousel__skeletonRow">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="fy-card fy-card--skeleton" />
          ))}
        </div>
      </section>
    </div>
  );
}