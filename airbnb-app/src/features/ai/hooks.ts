import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { properties, reviews } from '../../data/mockData';
import { queryKeys } from '../../api/queryKeys';

const aiApi = {
  search: async (query: string) => {
    await new Promise(r => setTimeout(r, 400));
    return { data: properties.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) };
  },
  chat: async (message: string) => {
    await new Promise(r => setTimeout(r, 600));
    const responses = [
      "I'd be happy to help you find the perfect stay!",
      "Our properties are located across Africa, Europe, and the Americas.",
      "You can filter by price, location, and number of guests.",
      "Each listing includes detailed photos and reviews from verified guests.",
    ];
    return { data: { response: responses[Math.floor(Math.random() * responses.length)] } };
  },
  getReviewSummary: async (listingId: string) => {
    await new Promise(r => setTimeout(r, 300));
    const propReviews = reviews.filter(r => r.propertyId === listingId);
    const avgRating = propReviews.length ? (propReviews.reduce((s, r) => s + r.rating, 0) / propReviews.length).toFixed(1) : '4.5';
    return { data: { summary: `${propReviews.length} reviews with an average rating of ${avgRating} stars.` } };
  },
  generateDescription: async (data: { title: string; type: string; amenities: string[]; location: string }) => {
    await new Promise(r => setTimeout(r, 500));
    return { data: { description: `${data.title} is a beautiful ${data.type.toLowerCase()} in ${data.location}. This property offers ${data.amenities.slice(0, 3).join(', ')} and much more.` } };
  },
  getRecommendations: async () => {
    await new Promise(r => setTimeout(r, 400));
    return { data: properties.slice(0, 4) };
  },
};

export function useAISearch() {
  return useMutation({
    mutationFn: (query: string) => aiApi.search(query),
    onError: (err: any) => toast.error(err.message || 'Search failed'),
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: ({ message }: { message: string }) => aiApi.chat(message),
    onError: (err: any) => toast.error(err.message || 'Chat failed'),
  });
}

export function useAIReviewSummary(listingId: string) {
  return useQuery({
    queryKey: queryKeys.aiReviewSummary(listingId),
    queryFn: () => aiApi.getReviewSummary(listingId),
    select: (data) => data.data,
    enabled: !!listingId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAIRecommendations() {
  return useQuery({
    queryKey: queryKeys.aiRecommendations,
    queryFn: () => aiApi.getRecommendations(),
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60 * 5,
  });
}

export function useGenerateDescription() {
  return useMutation({
    mutationFn: (data: { title: string; type: string; amenities: string[]; location: string }) =>
      aiApi.generateDescription(data),
    onSuccess: () => toast.success('Description generated!'),
  });
}