import BooksCarouselSection from "./BooksCarouselSection";

const BASE =
  "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended";

export default function SuggestedBooks() {
  return (
    <BooksCarouselSection
      title="Suggested Books"
      subtitle="Explore more titles"
      status="suggested"
    />
  );
}