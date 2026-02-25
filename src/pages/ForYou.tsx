import { useEffect, useState } from "react";
import SelectedForYou from "../components/forYou/SelectedForYou";
import BooksCarouselSection from "../components/forYou/BooksCarouselSection";
import ForYouSkeleton from "../components/skeletons/ForYouSkeleton";
import "../styles/foryou.css";

export default function ForYou() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (pageLoading) return <ForYouSkeleton />;

  return (
    <div style={{ padding: 24 }}>
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
