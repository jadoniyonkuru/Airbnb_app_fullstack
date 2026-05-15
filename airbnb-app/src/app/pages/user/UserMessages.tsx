import { useState, useEffect, useRef } from 'react';
import { Search, Send, MapPin, ChevronLeft, MessageSquare, Loader2 } from 'lucide-react';
import { useConversations, useConversation, useSendMessage } from '../../../features/messages/hooks';
import { useAuth } from '../../context/AuthContext';
import type { UserConversation } from '../../../features/messages/types';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=60&h=45&fit=crop';

const quickReplies = [
  "What time is check-in?",
  "Is parking available?",
  "Can I get a late checkout?",
  "What's the WiFi password?",
];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function ChatView({ convo, userId }: { convo: UserConversation; userId: string }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: full, isLoading } = useConversation(convo.id);
  const sendMutation = useSendMessage(convo.id);

  const messages = full?.messages ?? convo.messages ?? [];
  const other = convo.guestId === userId ? convo.host : convo.guest;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim() || sendMutation.isPending) return;
    const text = input.trim();
    setInput('');
    await sendMutation.mutateAsync(text);
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-[#EBEBEB] flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
          {other.avatar
            ? <img src={other.avatar} className="w-full h-full rounded-full object-cover" alt="" />
            : initials(other.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#222222] font-semibold text-sm">{other.name}</p>
          {convo.listing && <p className="text-[#717171] text-xs truncate">{convo.listing.title}</p>}
        </div>
      </div>

      {/* Property Banner */}
      {convo.listing && (
        <div className="px-4 py-2.5 border-b border-[#EBEBEB] flex items-center gap-3" style={{ background: '#F7F7F7' }}>
          <img
            src={convo.listing.photos?.[0]?.url ?? FALLBACK_IMG}
            alt=""
            className="w-12 h-9 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[#222222] text-xs font-semibold truncate">{convo.listing.title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#717171]" />
              <p className="text-[#717171] text-xs">{convo.listing.location}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-[#FF385C]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <MessageSquare className="w-10 h-10 text-[#DDDDDD]" />
            <p className="text-[#AAAAAA] text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === userId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0">
                    {msg.sender.avatar
                      ? <img src={msg.sender.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                      : initials(msg.sender.name)}
                  </div>
                )}
                <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: isMe ? '#FF385C' : '#F7F7F7',
                      color: isMe ? 'white' : '#222222',
                      borderBottomRightRadius: isMe ? 4 : undefined,
                      borderBottomLeftRadius: !isMe ? 4 : undefined,
                    }}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[#AAAAAA] mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 py-2 border-t border-[#EBEBEB] flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {quickReplies.map((qr, i) => (
          <button
            key={i}
            onClick={() => setInput(qr)}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-[#DDDDDD] text-[#484848] hover:border-[#FF385C] hover:text-[#FF385C] transition-colors whitespace-nowrap"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#EBEBEB] flex items-end gap-3">
        <div className="flex-1 border border-[#DDDDDD] rounded-2xl px-4 py-3 focus-within:border-[#FF385C] transition-colors">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Message your host..."
            rows={1}
            className="w-full text-sm text-[#222222] outline-none bg-transparent resize-none placeholder:text-[#AAAAAA] max-h-24"
          />
        </div>
        <button
          onClick={send}
          disabled={!input.trim() || sendMutation.isPending}
          className="w-10 h-10 bg-[#FF385C] hover:bg-[#E31C5F] rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
        >
          {sendMutation.isPending
            ? <Loader2 className="w-4 h-4 text-white animate-spin" />
            : <Send className="w-4 h-4 text-white" />}
        </button>
      </div>
    </>
  );
}

export function UserMessages() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const { data: conversations = [], isLoading } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  const activeConvo = conversations.find(c => c.id === activeId) ?? conversations[0] ?? null;

  useEffect(() => {
    if (!activeId && conversations.length > 0) setActiveId(conversations[0].id);
  }, [conversations, activeId]);

  const filtered = conversations.filter(c => {
    const other = c.guestId === userId ? c.host : c.guest;
    return (
      other.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.listing?.title ?? '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Messages</h1>
        <p className="text-[#717171] text-sm">Chat with your hosts and get trip support.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: 520 }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`w-full md:w-80 border-r border-[#EBEBEB] flex flex-col shrink-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-[#EBEBEB]">
              <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-[#717171]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search messages..."
                  className="flex-1 text-sm text-[#222222] outline-none bg-transparent placeholder:text-[#AAAAAA]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF385C]" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 p-6 text-center">
                  <MessageSquare className="w-10 h-10 text-[#DDDDDD]" />
                  <p className="text-[#AAAAAA] text-sm">No conversations yet.</p>
                  <p className="text-[#AAAAAA] text-xs">Message a host from a listing page to get started.</p>
                </div>
              ) : (
                filtered.map(convo => {
                  const other = convo.guestId === userId ? convo.host : convo.guest;
                  const lastMsg = convo.messages?.[convo.messages.length - 1];
                  return (
                    <button
                      key={convo.id}
                      onClick={() => { setActiveId(convo.id); setShowMobileChat(true); }}
                      className={`w-full p-4 flex items-start gap-3 text-left hover:bg-[#F7F7F7] transition-colors border-b border-[#EBEBEB] last:border-0 ${activeId === convo.id ? 'bg-[#FFF1F3]' : ''}`}
                    >
                      <div className="w-11 h-11 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {other.avatar
                          ? <img src={other.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                          : initials(other.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[#222222] font-semibold text-sm">{other.name}</p>
                          <span className="text-[#AAAAAA] text-xs">{lastMsg ? relativeTime(lastMsg.createdAt) : ''}</span>
                        </div>
                        {convo.listing && <p className="text-[#717171] text-xs truncate mb-0.5">{convo.listing.title}</p>}
                        <p className="text-[#484848] text-xs truncate">{lastMsg?.content ?? 'No messages yet'}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div className={`flex-1 flex flex-col min-w-0 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
            {activeConvo ? (
              <>
                <button onClick={() => setShowMobileChat(false)} className="md:hidden p-3 flex items-center gap-2 border-b border-[#EBEBEB] text-sm text-[#717171]">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <ChatView convo={activeConvo} userId={userId} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <MessageSquare className="w-12 h-12 text-[#DDDDDD]" />
                <p className="text-[#717171] text-sm">Select a conversation to read messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
