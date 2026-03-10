import React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import type { Book } from "../../types/Book";
import { formatDuration } from "../../utils/formatDuration";
import { TfiTimer } from "react-icons/tfi";

type Props = {
  title: string;
  subtitle?: string;
  status: "recommended" | "suggested";
};

const BASE = "https://us-central1-summaristt.cloudfunctions.net/getBooks";

export default function BooksCarouselSection({ title, subtitle, status }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

 const GAP = 20;

const getStep = () => {
  const el = scrollerRef.current;
  if (!el) return 240;

  const firstSlide = el.querySelector<HTMLElement>(".fy-slide");
  if (!firstSlide) return 240;

  return firstSlide.getBoundingClientRect().width + GAP;
};

const scrollByOne = (dir: "left" | "right") => {
  const el = scrollerRef.current;
  if (!el) return;

  const STEP = getStep();
  const maxScrollLeft = el.scrollWidth - el.clientWidth;
  const threshold = STEP / 2;

  const nearStart = el.scrollLeft <= threshold;
  const nearEnd = el.scrollLeft >= maxScrollLeft - threshold;

  if (dir === "right") {
    if (nearEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: STEP, behavior: "smooth" });
  } else {
    if (nearStart) el.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    else el.scrollBy({ left: -STEP, behavior: "smooth" });
  }
};

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}?status=${encodeURIComponent(status)}`);
        const data = await res.json();
     
        const list = Array.isArray(data)
          ? (data as Book[])
          : Array.isArray(data?.books)
          ? (data.books as Book[])
          : [];          

        const normalizedBooks = list.map((book: any) => ({
          ...book,
          duration: book.duration ?? book.audioLength ?? book.length ?? "",
        }));

        const booksWithDetails = await Promise.all(
          normalizedBooks.map(async (book: any) => {
            try {
              const res = await fetch(
                `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(book.id)}`
              );
              const fullBook = await res.json();

              let duration = "";

              if (fullBook.audioLink) {
                try {
                  const audio = document.createElement("audio");
                  audio.src = fullBook.audioLink;

                  await new Promise<void>((resolve) => {
                    audio.addEventListener("loadedmetadata", () => resolve(), {
                      once: true,
                    });
                  });

                  const total = Math.floor(audio.duration || 0);
                  const minutes = Math.floor(total / 60);
                  const seconds = total % 60;

                  duration = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                } catch {
                  duration = "";
                }
              }

              return {
                ...book,
                audioLink: fullBook.audioLink ?? book.audioLink,
                duration,
              };
            } catch {
              return book;
            }
          })
        );

        if (!alive) return;
        setBooks(booksWithDetails);
      } catch {
        if (!alive) return;
        setBooks([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [status]);

  const TimerIcon = TfiTimer as React.ElementType;
  const StarIcon = FiStar as React.ElementType;

  return (
    <section className="fy-carousel">
      <div className="fy-carousel__header">
        <h2 className="fy-carousel__title">{title}</h2>
        {subtitle ? <p className="fy-carousel__subtitle">{subtitle}</p> : null}
      </div>

      {loading ? (
        <div className="fy-carousel__skeletonRow">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="fy-card fy-card--skeleton" />
          ))}
        </div>
      ) : books.length ? (
        <div className="fy-carousel__wrap">
          <button
            type="button"
            className="fy-carousel__arrow fy-carousel__arrow--left"
            aria-label="Scroll left"
            onClick={() => scrollByOne("left")}>‹
          </button>

          <div ref={scrollerRef} className="fy-carousel__scroller">
            {books.map((b) => (
              <Link 
                key={b.id}
                to={`/book/${b.id}`}
                className="fy-slide"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article className="fy-card">
                  <div className="fy-card__coverWrap">
                    {b.subscriptionRequired ? (
                      <div className="fy-card__badge">Premium</div>
                    ) : null}

                    <img className="fy-card__cover" src={b.imageLink} alt={b.title} />
                  </div>

                  <h3 className="fy-card__title">{b.title}</h3>
                  <div className="fy-card__author">{b.author}</div>
                  <div className="fy-card__desc">{b.subTitle}</div>

                  <div className="fy-card__meta">
                    <span className="fy-meta">
                      <TimerIcon />
                      <span>{formatDuration(b.duration)}</span>
                    </span>
                    <span className="fy-meta">
                      <StarIcon />
                      <span>{Number(b.averageRating ?? 0).toFixed(1)}</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="fy-carousel__arrow fy-carousel__arrow--right"
            aria-label="Scroll right"
            onClick={() => scrollByOne("right")}
          >
            ›
          </button>
        </div>
      ) : (
        <div className="fy-carousel__empty">No books found.</div>
      )}
    </section>
  );
}