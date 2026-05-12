import { useState } from 'react';
import { Search, Send, Paperclip, Phone, Video, MoreHorizontal, MapPin, ChevronLeft } from 'lucide-react';

const conversations = [
  {
    id: '1',
    host: 'Claudine Uwera',
    avatar: 'CU',
    property: 'Skyline Penthouse in Kigali Heights',
    propertyImg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=60&h=45&fit=crop',
    lastMessage: "Hi John! Check-in is at 3:00 PM. I'll send you the door code the day before.",
    time: '10 min ago',
    unread: 1,
    online: true,
    checkIn: 'May 15, 2026',
    location: 'Kigali, Rwanda',
    messages: [
      { id: 1, from: 'user', text: "Hi Sarah! Looking forward to staying at your place. What time is check-in?", time: '9:45 AM', date: 'Today' },
      { id: 2, from: 'host', text: "Hi John! Welcome, so excited to have you! Check-in is at 3:00 PM. I'll send you the door code the day before.", time: '10:02 AM', date: 'Today' },
    ]
  },
  {
    id: '2',
    host: 'Boniface Mwamba',
    avatar: 'BM',
    property: 'Tropical Villa with Infinity Pool',
    propertyImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=60&h=45&fit=crop',
    lastMessage: "The pool is heated and ready for you! Enjoy your stay.",
    time: '2 hrs ago',
    unread: 0,
    online: false,
    checkIn: 'Jun 10, 2026',
    location: 'Nairobi, Kenya',
    messages: [
      { id: 1, from: 'host', text: "Welcome to Nairobi! Your booking is confirmed. Let me know if you need any local recommendations.", time: '3:00 PM', date: 'Yesterday' },
      { id: 2, from: 'user', text: "Thanks Michael! Is the pool available 24/7?", time: '4:15 PM', date: 'Yesterday' },
      { id: 3, from: 'host', text: "The pool is heated and ready for you! Available 7am to 10pm. Enjoy your stay.", time: '4:30 PM', date: 'Yesterday' },
    ]
  },
  {
    id: '3',
    host: 'Isabelle Renard',
    avatar: 'IR',
    property: 'Bohemian Loft in Le Marais',
    propertyImg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=60&h=45&fit=crop',
    lastMessage: "Bonjour! Your booking request has been received.",
    time: '3 days ago',
    unread: 0,
    online: false,
    checkIn: 'Jul 5, 2026',
    location: 'Paris, France',
    messages: [
      { id: 1, from: 'host', text: "Bonjour! Your booking request has been received. I'll confirm it shortly. Paris is beautiful this time of year!", time: '10:00 AM', date: '3 days ago' },
    ]
  },
];

const quickReplies = [
  "What time is check-in?",
  "Is parking available?",
  "Can I get a late checkout?",
  "What's the WiFi password?",
];

export function UserMessages() {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [messages, setMessages] = useState(conversations[0].messages);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  const selectConvo = (c: typeof conversations[0]) => {
    setActiveConvo(c);
    setMessages(c.messages);
    setShowMobileChat(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      from: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    }]);
    setMessage('');
  };

  const filteredConvos = conversations.filter(c =>
    c.host.toLowerCase().includes(search.toLowerCase()) ||
    c.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Messages</h1>
        <p className="text-[#717171] text-sm">Chat with your hosts and get trip support.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: 520 }}>
        <div className="flex h-full">
          {/* Conversations List */}
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
              {filteredConvos.map(convo => (
                <button
                  key={convo.id}
                  onClick={() => selectConvo(convo)}
                  className={`w-full p-4 flex items-start gap-3 text-left hover:bg-[#F7F7F7] transition-colors border-b border-[#EBEBEB] last:border-0 ${activeConvo.id === convo.id ? 'bg-[#FFF1F3]' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold">{convo.avatar}</div>
                    {convo.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[#222222] font-semibold text-sm">{convo.host}</p>
                      <span className="text-[#AAAAAA] text-xs">{convo.time}</span>
                    </div>
                    <p className="text-[#717171] text-xs truncate mb-1">{convo.property}</p>
                    <p className="text-[#484848] text-xs truncate">{convo.lastMessage}</p>
                  </div>
                  {convo.unread > 0 && (
                    <span className="w-5 h-5 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">{convo.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col min-w-0 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 border-b border-[#EBEBEB] flex items-center gap-3">
              <button onClick={() => setShowMobileChat(false)} className="md:hidden p-1 hover:bg-[#F7F7F7] rounded-lg">
                <ChevronLeft className="w-5 h-5 text-[#222222]" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold">{activeConvo.avatar}</div>
                {activeConvo.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#222222] font-semibold text-sm">{activeConvo.host}</p>
                <p className="text-[#717171] text-xs truncate">{activeConvo.property}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 rounded-xl hover:bg-[#F7F7F7] flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4 text-[#717171]" />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-[#F7F7F7] flex items-center justify-center transition-colors">
                  <Video className="w-4 h-4 text-[#717171]" />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-[#F7F7F7] flex items-center justify-center transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-[#717171]" />
                </button>
              </div>
            </div>

            {/* Property Banner */}
            <div className="px-4 py-2.5 border-b border-[#EBEBEB] flex items-center gap-3" style={{ background: '#F7F7F7' }}>
              <img src={activeConvo.propertyImg} alt="" className="w-12 h-9 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[#222222] text-xs font-semibold truncate">{activeConvo.property}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#717171]" />
                  <p className="text-[#717171] text-xs">{activeConvo.location} · Check-in: {activeConvo.checkIn}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => {
                const showDate = i === 0 || messages[i - 1].date !== msg.date;
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-[#EBEBEB]" />
                        <span className="text-xs text-[#AAAAAA] font-medium">{msg.date}</span>
                        <div className="flex-1 h-px bg-[#EBEBEB]" />
                      </div>
                    )}
                    <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.from === 'host' && (
                        <div className="w-8 h-8 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0">{activeConvo.avatar}</div>
                      )}
                      <div className={`max-w-[70%] flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                          style={{
                            background: msg.from === 'user' ? '#FF385C' : '#F7F7F7',
                            color: msg.from === 'user' ? 'white' : '#222222',
                            borderBottomRightRadius: msg.from === 'user' ? 4 : undefined,
                            borderBottomLeftRadius: msg.from === 'host' ? 4 : undefined,
                          }}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-[#AAAAAA] mt-1 px-1">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-[#EBEBEB] flex gap-2 overflow-x-auto scrollbar-hide">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(qr)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-[#DDDDDD] text-[#484848] hover:border-[#FF385C] hover:text-[#FF385C] transition-colors whitespace-nowrap"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#EBEBEB] flex items-end gap-3">
              <button className="w-9 h-9 rounded-xl hover:bg-[#F7F7F7] flex items-center justify-center transition-colors shrink-0">
                <Paperclip className="w-4 h-4 text-[#717171]" />
              </button>
              <div className="flex-1 border border-[#DDDDDD] rounded-2xl px-4 py-3 focus-within:border-[#FF385C] transition-colors">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Message your host..."
                  rows={1}
                  className="w-full text-sm text-[#222222] outline-none bg-transparent resize-none placeholder:text-[#AAAAAA] max-h-24"
                />
              </div>
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-[#FF385C] hover:bg-[#E31C5F] rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}