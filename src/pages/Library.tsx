import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getUserLibrary } from "../utils/library";
import { Link } from "react-router-dom";
import { FiStar, FiClock } from "react-icons/fi";
import "../styles/library.css";
import { formatDuration } from "../utils/formatDuration";
import LibrarySkeleton from "../components/skeletons/LibrarySkeleton";

type LibraryBook = {
  bookId: string;
  title: string;
  author: string;
  imageLink: string;
  audioLink?: string;
  summary?: string;
  subTitle?: string;
  duration?: string | number;
  averageRating?: number;
  totalRating?: number;
  keyIdeas?: number;
  type?: string;
  status?: string;
  subscriptionRequired?: boolean;
  tags?: string[];
  bookDescription?: string;
  authorDescription?: string;
  isSaved: boolean;
  isFinished: boolean;
  progress?: number;
};

export default function Library() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getUserLibrary(user.uid);
      const libraryBooks = data as LibraryBook[];

      const booksWithDurations = await Promise.all(
        libraryBooks.map(async (book) => {
          if (book.duration || !book.audioLink) return book;

          try {
            const audio = document.createElement("audio");
            audio.src = book.audioLink ?? "";

            await new Promise<void>((resolve) => {
              audio.addEventListener("loadedmetadata", () => resolve(), {
                once: true,
              });
            });

            const total = Math.floor(audio.duration || 0);
            const minutes = Math.floor(total / 60);
            const seconds = total % 60;

            return {
              ...book,
              duration: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
            };
          } catch {
            return book;
          }
        })
      );

      setBooks(booksWithDurations);
    } catch (error) {
      console.error("Failed to load library:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  const savedBooks = books.filter((book) => book.isSaved && !book.isFinished);
  const finishedBooks = books.filter((book) => book.isFinished);

  if (loading) {
  return <LibrarySkeleton count={4} />;
}
  return (
    <div className="library-page">
      <section className="library-section">
        <h2>Saved Books</h2>
        <p>{savedBooks.length} items</p>

        {savedBooks.length === 0 ? (
          <div className="library-empty">
            <h3>Save your favorite books!</h3>
            <p>When you save a book, it will appear here.</p>
          </div>
        ) : (
          <div className="library-grid">
            {savedBooks.map((book) => (
              <Link to={`/book/${book.bookId}`} key={book.bookId} className="library-card">
                <div className="library-card__imgWrapper">
                <img src={book.imageLink} alt={book.title} className="library-card__img" />
                </div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                <p className="library-subtitle">{book.subTitle}</p>

                <div className="library-meta">
                <span>
                  <FiClock style={{ marginRight: "4px" }} />
                  {formatDuration(book.duration)}
                </span>

                <span>
                  <FiStar style={{ marginRight: "4px", color: "#f5b50a" }} />
                  {book.averageRating ?? 0}
                </span>
              </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="library-section">
        <h2>Finished</h2>
        <p>{finishedBooks.length} items</p>

        {finishedBooks.length === 0 ? (
          <div className="library-empty">
            <h3>Done and dusted!</h3>
            <p>When you finish a book, you can find it here later.</p>
          </div>
        ) : (
          <div className="library-grid">
            {finishedBooks.map((book) => (
              <Link to={`/book/${book.bookId}`} key={book.bookId} className="library-card">
                <div className="library-card__imgWrapper">
                  <img src={book.imageLink} alt={book.title} className="library-card__img" />
                </div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                <p className="library-subtitle">{book.subTitle ?? ""}</p>

                <div className="library-meta">
                  <span className="library-meta__item">
                    <FiClock className="library-meta__icon" />
                    {formatDuration(book.duration)}
                  </span>

                  <span className="library-meta__item">
                    <FiStar className="library-meta__icon library-meta__icon--star" />
                    {book.averageRating ?? 0}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}