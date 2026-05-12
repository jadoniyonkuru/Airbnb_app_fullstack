export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  listingId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}
