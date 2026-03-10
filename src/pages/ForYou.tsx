import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SelectedForYou from "../components/forYou/SelectedForYou";
import BooksCarouselSection from "../components/forYou/BooksCarouselSection";
import ForYouSkeleton from "../components/skeletons/ForYouSkeleton";
import "../styles/foryou.css";
import { FaCheckCircle } from "react-icons/fa";

export default function ForYou() {
  const [pageLoading, setPageLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const CircleIcon = FaCheckCircle as React.ElementType;

  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  useEffect(() => {
    if (!location.state?.successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      navigate(location.pathname, { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (pageLoading) {
    return (
      <div className="fy-page" style={{ padding: 24 }}>
        {successMessage && (
          <div className="auth-success-banner">
            <CircleIcon className="auth-success-icon" />
            <span>{successMessage}</span>
          </div>
        )}
        <ForYouSkeleton />
      </div>
    );
  }
  
  return (
    <div className="fy-page" style={{ padding: 24 }}>
      {successMessage && (
        <div className="auth-success-banner">
          {successMessage}
        </div>
      )}

      <SelectedForYou />

      <BooksCarouselSection
        title="Recommended For You"
        subtitle="We think you'll like these"
        status="recommended"
      />

      <BooksCarouselSection
        title="Suggested Books"
        subtitle="Explore more titles"
        status="suggested"
      />
    </div>
  );
}
