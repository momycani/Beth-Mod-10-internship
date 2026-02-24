import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

const URL =
  "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected";

type AnyBook = Record<string, any>;

export default function SelectedForYou() {
  const [book, setBook] = useState<AnyBook | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setStatus("loading");
        const res = await fetch(URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.books)
          ? data.books
          : [];

        if (!alive) return;
        setBook(list[0] ?? null);
        setStatus("ready");
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setStatus("error");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <section className="selected">
        <h2 className="selected__title">Selected just for you</h2>
        <div className="selected__card selected__card--skeleton" />
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="selected">
        <h2 className="selected__title">Selected just for you</h2>
        <div className="selected__error">Couldn't load selected books.</div>
      </section>
    );
  }

  if (!book) return null;

  const title = book.title ?? "Untitled";
  const author = book.author ?? "Unknown author";
  const cover = book.imageLink ?? "";
  const duration = book.audioLength ?? book.duration ?? "3 mins";

  return (
    <section className="selected">
      <h2 className="selected__title">Selected just for you</h2>

      <Link
  to={`/book/${book.id}`}
  className="selected__card"
  style={{ textDecoration: "none", color: "inherit", display: "block" }}
>
  <div className="selected__left">
    <div className="selected__headline">{book.subTitle}</div>
  </div>

  <div className="selected__divider" />

  <div className="selected__coverWrap">
    {cover ? (
      <img className="selected__cover" src={cover} alt={title} />
    ) : (
      <div className="selected__coverFallback" />
    )}
  </div>

  <div className="selected__right">
    <div className="selected__bookTitle">{title}</div>
    <div className="selected__author">{author}</div>

    <div className="selected__meta">
      <button
        className="selected__play"
        aria-label="Play"
        type="button"
        onClick={(e) => e.preventDefault()}   // keeps button from navigating
      >
        <FaPlay />
      </button>
      <div className="selected__time">{duration}</div>
    </div>
  </div>
</Link>
    </section>
  );
}
