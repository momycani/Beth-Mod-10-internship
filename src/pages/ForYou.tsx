import SelectedForYou from "../components/forYou/SelectedForYou";
import BooksCarouselSection from "../components/forYou/BooksCarouselSection";
import "../styles/foryou.css";

export default function ForYou() {
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
