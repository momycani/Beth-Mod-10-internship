import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/book.css";
import BookSkeleton from "../components/skeletons/BookSkeleton";
import { FiStar, FiClock, FiMic } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { RiBookOpenLine, RiHeadphoneLine, RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { auth } from "../firebase";
import { addBookToLibrary, removeBookFromLibrary, getLibraryBook } from "../utils/library";
import { formatDuration } from "../utils/formatDuration";

const BOOK_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

type Book = {
  id?: string;
  title?: string;
  author?: string;
  subTitle?: string;
  imageLink?: string;
  audioLink?: string;
  summary?: string;
  averageRating?: number;
  totalRating?: number;
  duration?: string;
  keyIdeas?: number;
  type?: string;
  status?: string;
  subscriptionRequired?: boolean;
  tags?: string[];
  bookDescription?: string;
  authorDescription?: string;
};

export default function Book({
  onRequireLogin,
}: {
  onRequireLogin: () => void;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [audioDuration, setAudioDuration] = useState("");
  const isGuest = localStorage.getItem("isGuest") === "true";

  const currentUser = auth.currentUser;
  const isPremium = currentUser
    ? localStorage.getItem(`isPremium:${currentUser.uid}`) === "true"
    : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const safeId = id;
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");
        setBook(null);
        setError("");

        const start = Date.now();

        const res = await fetch(`${BOOK_URL}?id=${encodeURIComponent(safeId)}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const data = await res.json();
        
        const normalizedBook = {
          ...data,
          duration: data.duration ?? data.audioLength ?? data.length ?? "",
        };

        setBook(normalizedBook);

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

  useEffect(() => {
  if (!book?.audioLink) {
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
}, [book?.audioLink]);


  useEffect(() => {
    const checkSaved = async () => {
      const user = auth.currentUser;
      const bookId = String(book?.id ?? id ?? "");

      if (!user || !bookId) {
        setIsSaved(false);
        return;
      }

      try {
        const saved = await getLibraryBook(user.uid, bookId);
        setIsSaved(!!saved?.isSaved);
      } catch (err) {
        console.error("Failed to check saved status:", err);
      }
    };

    checkSaved();
  }, [book, id]);

  const handleOpenPlayer = () => {
    if (isGuest) {
      localStorage.setItem("postAuthRedirect", `/player/${id}`);
      onRequireLogin();
      return;
    }

    if (book?.subscriptionRequired && !isPremium) {
      navigate("/choose-plan", {
        state: {
          from: `/player/${id}`,
          bookId: id,
        },
      });
      return;
    }

    navigate(`/player/${id}`);
  };

  const handleLibraryToggle = async () => {
    const user = auth.currentUser;
    const bookId = String(book?.id ?? id ?? "");

    if (!user) {      
      onRequireLogin();
      return;
    }

    if (!book || !bookId) {      
      return;
    }

    try {
      setSaving(true);

      if (isSaved) {
        
        await removeBookFromLibrary(user.uid, bookId);
        setIsSaved(false);
        
      } else {
        
        await addBookToLibrary(user.uid, {
          bookId,
          title: book.title ?? "Untitled",
          author: book.author ?? "Unknown author",
          imageLink: book.imageLink ?? "",          
          subTitle: book.subTitle ?? "",
          duration: book.duration ?? "",
          audioLink: book.audioLink ?? "",
          averageRating: book.averageRating ?? 0,
          subscriptionRequired: book.subscriptionRequired,
        });
        setIsSaved(true);
        
      }
    } catch (err) {
      console.error("Library update failed:", err);
    } finally {
      setSaving(false);
    }
  };

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

  const title = book.title ?? "Untitled";
  const author = book.author ?? "Unknown author";
  const subTitle = book.subTitle ?? "";
  const avg = book.averageRating ?? 0;
  const total = book.totalRating ?? 0;
  const duration = audioDuration || formatDuration(book.duration);
  const keyIdeas = book.keyIdeas ?? 0;
  const type = book.type ?? "";
  const imageLink = book.imageLink ?? "";
  const tags = book.tags ?? [];
  const description = book.bookDescription ?? "";
  

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="book-layout">
              <div className="book-layout__left">
                <div className="book-cover--mobile">
                  <img className="book-cover" src={imageLink} alt={title} />
                </div>

                <h1 className="book-title">
                  {title}
                  {book.subscriptionRequired ? " (Premium)" : ""}
                </h1>

                <div className="book-author">{author}</div>
                {subTitle ? <div className="book-subtitle">{subTitle}</div> : null}

                <div className="book-divider" />

                <div className="book-stats">
                  <div className="stat">
                    <FiStar className="stat-icon" />
                    <span>
                      <strong>{avg.toFixed(1)}</strong> ({total} ratings)
                    </span>
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
                  <button
                    className="book-btn book-btn--primary"
                    type="button"
                    onClick={handleOpenPlayer}
                  >
                    <RiBookOpenLine className="book-btn__icon" />
                    <span>Read</span>
                  </button>

                  <button
                    className="book-btn book-btn--secondary"
                    type="button"
                    onClick={handleOpenPlayer}
                  >
                    <RiHeadphoneLine className="book-btn__icon" />
                    <span>Listen</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleLibraryToggle}
                  disabled={saving}
                  className={`book-libraryLink ${isSaved ? "book-libraryLink--active" : ""}`}
                  aria-label={isSaved ? "Remove from library" : "Add to library"}
                >
                  {isSaved ? (
                    <RiBookmarkFill className="book-libraryIcon" />
                  ) : (
                    <RiBookmarkLine className="book-libraryIcon" />
                  )}
                  <span>{isSaved ? "Saved in My Library" : "Add title to My Library"}</span>
                </button>

                {tags.length > 0 && (
                  <div className="book-section-title">
                    <h6>What's it about?</h6>
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

                <div className="book-summary">
                  {(description || book.summary || "").split("\n").filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {book.authorDescription && (
                  <div className="book-section-title">
                    <h6>About the author</h6>
                    <p className="book-section-author" style={{ lineHeight: 1.6 }}>{book.authorDescription}</p>
                  </div>
                )}

                <p style={{ marginTop: 24 }}>
                  <Link to="/foryou">← Back</Link>
                </p>
              </div>

              <div className="book-layout__right">
                {imageLink ? (
                  <img
                    src={imageLink}
                    className="book-cover"
                    alt={title}
                    style={{ maxHeight: 520, objectFit: "contain" }}
                  />
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