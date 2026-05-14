import { useState } from 'react';
import { useAiChat } from '../../../features/ai/hooks';

export function AIChat({ listingId }: { listingId?: string }) {
  const [sessionId] = useState(() => `session-${Math.random().toString(36).slice(2,9)}`);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role:string,text:string}[]>([]);
  const mutation = useAiChat();

  const send = async () => {
    if (!input.trim()) return;
    const m = input.trim();
    setMessages(s => [...s, { role: 'user', text: m }]);
    setInput('');
    try {
      const res = await mutation.mutateAsync({ sessionId, message: m, listingId });
      setMessages(s => [...s, { role: 'assistant', text: res.response || res }]);
    } catch (e) {
      setMessages(s => [...s, { role: 'assistant', text: 'Sorry, I could not get a reply.' }]);
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-2xl border border-[#EBEBEB] shadow-sm">
      <div className="space-y-2 mb-3 h-48 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right text-sm' : 'text-left text-sm text-[#333]'}>
            <div className="inline-block p-2 rounded-md" style={{ backgroundColor: m.role === 'user' ? '#FF385C' : '#F7F7F7', color: m.role === 'user' ? '#fff' : '#222' }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about this listing or booking..." className="flex-1 px-3 py-2 rounded-xl border border-[#DDDDDD] outline-none" />
        <button onClick={send} className="px-4 py-2 bg-[#FF385C] text-white rounded-xl">Send</button>
      </div>
    </div>
  );
}

export default AIChat;
