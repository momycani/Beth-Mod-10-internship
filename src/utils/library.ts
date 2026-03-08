import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export type LibraryBook = {
  bookId: string;
  title: string;
  author: string;
  imageLink: string;
  subTitle?: string;
  duration?: string;
  audioLink?: string;
  averageRating?: number;
  subscriptionRequired?: boolean;
  isSaved: boolean;
  isFinished: boolean;
  progress?: number;
  addedAt?: unknown;
  finishedAt?: unknown;
};

export async function addBookToLibrary(uid: string, book: Omit<LibraryBook, "isSaved" | "isFinished">) {
  const ref = doc(db, "users", uid, "library", String(book.bookId));

  await setDoc(
    ref,
    {
      ...book,
      isSaved: true,
      isFinished: false,
      progress: 0,
      addedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function removeBookFromLibrary(uid: string, bookId: string) {
  const ref = doc(db, "users", uid, "library", String(bookId));
  await deleteDoc(ref);
}

export async function getLibraryBook(uid: string, bookId: string) {
  const ref = doc(db, "users", uid, "library", String(bookId));
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function markBookFinished(uid: string, bookId: string) {
  const ref = doc(db, "users", uid, "library", String(bookId));
  await setDoc(
    ref,
    {
      isSaved: true,
      isFinished: true,
      progress: 100,
      finishedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateBookProgress(uid: string, bookId: string, progress: number) {
  const ref = doc(db, "users", uid, "library", String(bookId));
  await setDoc(
    ref,
    {
      progress,
    },
    { merge: true }
  );
}

export async function getUserLibrary(uid: string) {
  const ref = collection(db, "users", uid, "library");
  const q = query(ref, orderBy("addedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}