import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/book.css"
import BookSkeleton from "../components/skeletons/BookSkeleton";
import { FiStar, FiClock, FiMic } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { RiBookOpenLine, RiHeadphoneLine, RiBookmarkLine } from "react-icons/ri";

const BOOK_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

type Book = {
  id?: string;
  title?: string;
  author?: string;
  subTitle?: string;

  averageRating?: number;
  totalRating?: number;

  // some APIs use "duration" or "audioLength" or "time"
  duration?: string; // ex "04:40"
  keyIdeas?: number;

  type?: string; // ex "Audio & Text"
  imageLink?: string;

  tags?: string[];

  bookDescription?: string;
  authorDescription?: string;

  subscriptionRequired?: boolean;  // ✅ add this
};

export default function Book() {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
  if (!id) return;

  const controller = new AbortController();

  async function load() {
    try {
      setStatus("loading");
      setBook(null);
      setError("");

      const start = Date.now();

      const res = await fetch(
        `${BOOK_URL}?id=${encodeURIComponent(id!)}`,
        { signal: controller.signal }
      );

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();
      
      setBook(data);

      const elapsed = Date.now() - start;
      if (elapsed < 800) await new Promise(r => setTimeout(r, 800 - elapsed));

      setStatus("ready");
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  load();
  return () => controller.abort();
}, [id]);

  if (status === "loading") {
  return <BookSkeleton />;
}

  if (status === "error") {
    return (
      <div style={{ padding: 32 }}>
        <h2>Couldn’t load book</h2>
        <p>{error}</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  if (!book) return null;

  // safe fallbacks
  const title = book.title ?? "Untitled";
  const author = book.author ?? "Unknown author";
  const subTitle = book.subTitle ?? "";
  const avg = book.averageRating ?? 0;
  const total = book.totalRating ?? 0;
  const duration = book.duration ?? "";
  const keyIdeas = book.keyIdeas ?? 0;
  const type = book.type ?? "";
  const imageLink = book.imageLink ?? "";
  const tags = book.tags ?? [];

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="book-layout">
              <div className="book-layout__left">
                <div className="book-cover--mobile">
                  <img className="book-cover" src={book.imageLink} alt={book.title} />
                </div>
                <h1 className="book-title">{title}{book.subscriptionRequired ? " (Premium)" : ""}</h1>
                <div className="book-author">{author}</div>
                {subTitle ? <div className="book-subtitle">{subTitle}</div> : null}

                <div className="book-divider" />

                <div className="book-stats">
                <div className="stat">
                  <FiStar className="stat-icon" />
                  <span><strong>{avg.toFixed(1)}</strong> ({total} ratings)</span>
                </div>

                <div className="stat">
                  <FiClock className="stat-icon" />
                  <span>{duration}</span>
                </div>

                <div className="stat">
                  <FiMic className="stat-icon" />
                  <span>{type}</span>
                </div>

                <div className="stat">
                  <HiOutlineLightBulb size={20} className="stat-icon" />
                  <span>{keyIdeas} Key ideas</span>
                </div>
              </div>

                <div className="book-divider" />

                <div className="book-actions">
                  <button className="book-btn book-btn--primary" type="button">
                    <RiBookOpenLine className="book-btn__icon" />
                    <span>Read</span>
                  </button>

                  <button className="book-btn book-btn--secondary" type="button">
                    <RiHeadphoneLine className="book-btn__icon" />
                    <span>Listen</span>
                  </button>
                </div>

                <button type="button" className="book-libraryLink">
                  <RiBookmarkLine className="book-libraryIcon" />
                  <span>Add title to My Library</span>
                </button>
                  
                {/* tags */}
                {tags.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <h6 style={{ marginBottom: 16 }}>What's it about?</h6>
                    <div className="book-tags" style={{ marginBottom: 24 }}>
                      {tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            padding: "8px 24px",
                            borderRadius: 8,
                            background: "#f1f3f5",
                            fontWeight: 400,
                            fontSize: 16,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* descriptions */}
                {book.bookDescription && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ lineHeight: 1.6 }}>{book.bookDescription}</p>
                  </div>
                )}

                {book.authorDescription && (
                  <div style={{ marginBottom: 18 }}>
                    <h6>About the author</h6>
                    <p style={{ lineHeight: 1.6 }}>{book.authorDescription}</p>
                  </div>
                )}

                <p style={{ marginTop: 24 }}>
                  <Link to="/for-you">← Back</Link>
                </p>
              </div>

              {/* RIGHT: cover */}
              <div className="book-layout__right">
                {imageLink ? (
                  <img
                    src={imageLink}
                    className="book-cover"
                    alt={title}
                    style={{ maxHeight: 520, objectFit: "contain" }} />
                ) : (
                  <div style={{ height: 520 }} className="skeleton sk-details-image" />
                )}
              </div>
            </div>
            </div>
          </section>
        </div>  
    </div>    
  );
}
