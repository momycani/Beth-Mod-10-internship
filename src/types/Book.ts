export type Book = {
  id: string;
  author: string;
  title: string;
  subTitle?: string;
  imageLink?: string;
  audioLink?: string;
  duration?: string | number;   // ← ADD THIS

  audioLength?: number | string; // ← OPTIONAL but recommended
  totalRating?: number;
  averageRating?: number;
  keyIdeas?: number;
  type?: string;
  status?: string;
  subscriptionRequired?: boolean;
  summary?: string;
  tags?: string[];
  bookDescription?: string;
  authorDescription?: string;
};
