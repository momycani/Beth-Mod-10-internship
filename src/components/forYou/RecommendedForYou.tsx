import BooksCarouselSection from "./BooksCarouselSection";

const BASE =
  "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended";

export default function RecommendedForYou() {
  return (
    <BooksCarouselSection
      title="Recommended For You"
      subtitle="We think you'll like these"
      status="recommended"
    />
  );
}