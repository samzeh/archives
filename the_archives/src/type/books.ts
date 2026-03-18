export interface ProfileBook {
  book_id: string;
  your_ratings: number;
  comment: string;
  status: "to_read" | "finished";
}

export interface Book {
  id?: number;
  book_id?: number | string;
  title: string;
  authors?: string[] | string;
  average_rating?: number;
  genres?: string[] | string;
  description?: string;
  your_ratings?: number;
  comment?: string;
  status?: "to_read" | "finished";
}