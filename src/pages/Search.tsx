import React from "react";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/book.css";
import { FiStar, FiMic } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { RiBookOpenLine } from "react-icons/ri";
import { formatDuration } from "../utils/formatDuration";
import { TfiTimer } from "react-icons/tfi";

type Book = {
  id?: string;
  title?: string;
  author?: string;
  subTitle?: string;
  imageLink?: string;
  averageRating?: number;
  totalRating?: number;
  duration?: string | number;
  audioLink?: string;
  keyIdeas?: number;
  type?: string;
  subscriptionRequired?: boolean;
  bookDescription?: string;
};

function SearchResultCard({ book }: { book: Book }) {
  const [audioDuration, setAudioDuration] = useState("");

  useEffect(() => {
    if (!book.audioLink) {
      setAudioDuration("");
      return;
    }

    let cancelled = false;

    const loadDuration = async () => {
      try {
        const audio = document.createElement("audio");
        audio.src = book.audioLink ?? "";

        await new Promise<void>((resolve) => {
          audio.addEventListener("loadedmetadata", () => resolve(), {
            once: true,
          });
        });

        if (cancelled) return;

        const total = Math.floor(audio.duration || 0);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;

        setAudioDuration(
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      } catch {
        if (!cancelled) setAudioDuration("");
      }
    };

    loadDuration();

    return () => {
      cancelled = true;
    };
  }, [book.audioLink]);

  const id = book.id ?? "";
  const title = book.title ?? "Untitled";
  const author = book.author ?? "Unknown author";
  const subTitle = book.subTitle ?? "";
  const avg = book.averageRating ?? 0;
  const total = book.totalRating ?? 0;
  const duration = audioDuration || formatDuration(book.duration);
  const keyIdeas = book.keyIdeas ?? 0;
  const type = book.type ?? "";
  const imageLink = book.imageLink ?? "";
  const description = book.bookDescription ?? "";

  const TimerIcon = TfiTimer as React.ElementType;
  const StarIcon = FiStar as React.ElementType;
  const MicIcon = FiMic as React.ElementType;
  const BulbIcon = HiOutlineLightBulb as React.ElementType;
  const BookopenIcon = RiBookOpenLine as React.ElementType;

  return (
    <div
      className="book-layout"
      style={{
        border: "1px solid #e6eaef",
        borderRadius: 16,
        padding: 24,
        background: "#fff",
      }}
    >
      <div className="book-layout__left">
        <h2 className="book-title" style={{ fontSize: 28, marginBottom: 8 }}>
          {title}
          {book.subscriptionRequired ? " (Premium)" : ""}
        </h2>

        <div className="book-author">{author}</div>
        {subTitle ? <div className="book-subtitle">{subTitle}</div> : null}

        <div className="book-divider" />

        <div className="book-stats">
          <div className="stat">
            <StarIcon className="stat-icon" />
            <span>
              <strong>{avg.toFixed(1)}</strong> ({total} ratings)
            </span>
          </div>

          <div className="stat">
            <TimerIcon className="stat-icon" />
            <span>{duration}</span>
          </div>

          <div className="stat">
            <MicIcon className="stat-icon" />
            <span>{type}</span>
          </div>

          <div className="stat">
            <BulbIcon size={20} className="stat-icon" />
            <span>{keyIdeas} Key ideas</span>
          </div>
        </div>

        <div className="book-divider" />

        <div className="book-summary">
          {(description || "")
            .split("\n")
            .filter(Boolean)
            .slice(0, 2)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>

        <div className="book-actions" style={{ marginTop: 20 }}>
          <Link
            to={`/book/${id}`}
            className="book-btn book-btn--primary"
            style={{ textDecoration: "none" }}
          >
            <BookopenIcon className="book-btn__icon" />
            <span>View Book</span>
          </Link>
        </div>
      </div>

      <div className="book-layout__right">
        {imageLink ? (
          <img
            src={imageLink}
            className="book-cover"
            alt={title}
            style={{ maxHeight: 320, objectFit: "contain" }}
          />
        ) : (
          <div style={{ height: 320 }} className="skeleton sk-details-image" />
        )}
      </div>
    </div>
  );
}

export default function Search() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") ?? "";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(query)}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data.map((b: any) => ({
              ...b,
              duration: b.duration ?? b.audioLength ?? b.length ?? "",
            }))
          : [];

        setBooks(normalized);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div style={{ marginBottom: 32 }}>
              <h1 className="book-title" style={{ fontSize: 32 }}>
                Search Results
              </h1>

              {query ? (
                <p className="book-subtitle">
                  Results for <strong>{query}</strong>
                </p>
              ) : (
                <p className="book-subtitle">Start typing above to search for books.</p>
              )}
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && query && books.length === 0 && (
              <p>No results found for "{query}".</p>
            )}

            <div style={{ display: "grid", gap: 32 }}>
              {books.map((book) => (
                <SearchResultCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}