export interface MessageSender {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface UserMessage {
  id: string;
  content: string;
  senderId: string;
  sender: MessageSender;
  conversationId: string;
  createdAt: string;
}

export interface ConversationListing {
  id: string;
  title: string;
  location: string;
  photos: { url: string }[];
}

export interface UserConversation {
  id: string;
  guestId: string;
  hostId: string;
  listingId?: string | null;
  guest: MessageSender;
  host: MessageSender;
  listing?: ConversationListing | null;
  messages: UserMessage[];
  createdAt: string;
  updatedAt: string;
}
