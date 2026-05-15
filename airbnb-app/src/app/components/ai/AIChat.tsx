import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare } from 'lucide-react';
import { useAiChat } from '../../../features/ai/hooks';

interface Message { role: 'user' | 'assistant'; text: string; }

export function AIChat({ listingId }: { listingId?: string }) {
  const [sessionId] = useState(() => `s-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: listingId
        ? 'Hi! I\'m your AI assistant. Ask me anything about this listing or your booking.'
        : 'Hi! I\'m here to help. Ask me anything about your stay, booking process, or property details.' }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mutation = useAiChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim() || mutation.isPending) return;
    const text = input.trim();
    setInput('');
    setMessages(s => [...s, { role: 'user', text }]);
    try {
      const res = await mutation.mutateAsync({ sessionId, message: text, listingId });
      setMessages(s => [...s, { role: 'assistant', text: res.response ?? 'Sorry, I had trouble responding.' }]);
    } catch {
      setMessages(s => [...s, { role: 'assistant', text: 'Sorry, I could not connect right now. Please try again.' }]);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FF385C] hover:bg-[#E31C5F] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] flex flex-col overflow-hidden" style={{ height: 440 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#EBEBEB]" style={{ background: '#FF385C' }}>
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">AI Support</p>
          <p className="text-white/75 text-xs">Always here to help</p>
        </div>
        <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center mr-2 mt-auto shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
              style={{
                background: m.role === 'user' ? '#FF385C' : '#F7F7F7',
                color: m.role === 'user' ? 'white' : '#222222',
                borderBottomRightRadius: m.role === 'user' ? 4 : undefined,
                borderBottomLeftRadius: m.role === 'assistant' ? 4 : undefined,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center mr-2 shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-[#F7F7F7] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-[#AAAAAA] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#AAAAAA] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#AAAAAA] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#EBEBEB] flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder="Ask anything..."
          className="flex-1 text-sm px-3 py-2 rounded-xl border border-[#DDDDDD] outline-none focus:border-[#FF385C] transition-colors"
        />
        <button
          onClick={send}
          disabled={!input.trim() || mutation.isPending}
          className="w-9 h-9 bg-[#FF385C] hover:bg-[#E31C5F] rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}

export default AIChat;
