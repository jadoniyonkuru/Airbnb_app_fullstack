import { useState } from 'react';
import { Search, Send, Paperclip, Phone, Video, MoreHorizontal, Star, ChevronLeft } from 'lucide-react';

const conversations = [
  {
    id: '1',
    guest: 'Kevin Malone',
    avatar: 'KM',
    property: 'Skyline Penthouse in Kigali Heights',
    lastMessage: "Hi Jean Pierre! Just wanted to confirm the check-in time for tomorrow.",
    time: '2 min ago',
    unread: 2,
    online: true,
    checkIn: 'May 15, 2026',
    messages: [
      { id: 1, from: 'guest', text: "Hello Jean Pierre! I'm so excited about my upcoming stay.", time: '10:15 AM', date: 'May 12' },
      { id: 2, from: 'host', text: "Hi John! Welcome, we're excited to have you! Let me know if you need anything.", time: '10:32 AM', date: 'May 12' },
      { id: 3, from: 'guest', text: "Thanks! Quick question — what's the parking situation like?", time: '11:04 AM', date: 'May 12' },
      { id: 4, from: 'host', text: "There's free street parking right in front of the building, and a paid garage just 50m away if needed.", time: '11:10 AM', date: 'May 12' },
      { id: 5, from: 'guest', text: "Perfect, that's very helpful!", time: '11:14 AM', date: 'May 12' },
      { id: 6, from: 'guest', text: "Hi Jean Pierre! Just wanted to confirm the check-in time for tomorrow.", time: '9:00 AM', date: 'Today' },
    ]
  },
  {
    id: '2',
    guest: 'Aisha Diallo',
    avatar: 'AD',
    property: 'Hilltop Cottage with Garden Views',
    lastMessage: "The cottage is absolutely beautiful! Thank you so much.",
    time: '1 hr ago',
    unread: 0,
    online: false,
    checkIn: 'May 22, 2026',
    messages: [
      { id: 1, from: 'guest', text: "Hi, I just arrived and the cottage is absolutely beautiful! Thank you so much.", time: '8:30 AM', date: 'Today' },
      { id: 2, from: 'host', text: "So glad you love it Emma! Make yourself at home. I'll be available if you need anything at all.", time: '8:45 AM', date: 'Today' },
    ]
  },
  {
    id: '3',
    guest: 'Rafael Vargas',
    avatar: 'RV',
    property: 'Skyline Penthouse in Kigali Heights',
    lastMessage: "Is it possible to arrange a late checkout?",
    time: '3 hrs ago',
    unread: 1,
    online: false,
    checkIn: 'May 18, 2026',
    messages: [
      { id: 1, from: 'guest', text: "Hi Jean Pierre, is it possible to arrange a late checkout? I have a flight at 6pm.", time: '7:45 AM', date: 'Today' },
    ]
  },
  {
    id: '4',
    guest: 'Thabo Nkosi',
    avatar: 'TN',
    property: 'Executive Studio — Kimihurura',
    lastMessage: "Great, see you on the 26th! Looking forward to it.",
    time: 'Yesterday',
    unread: 0,
    online: true,
    checkIn: 'Mar 26, 2026',
    messages: [
      { id: 1, from: 'guest', text: "Great, see you on the 26th! Looking forward to it.", time: '6:30 PM', date: 'Yesterday' },
    ]
  },
  {
    id: '5',
    guest: 'Kwame Asante',
    avatar: 'KA',
    property: 'Hilltop Cottage with Garden Views',
    lastMessage: "Can you send me the WiFi password again please?",
    time: '2 days ago',
    unread: 0,
    online: false,
    checkIn: 'Mar 17, 2026',
    messages: [
      { id: 1, from: 'guest', text: "Can you send me the WiFi password again please?", time: '10:20 AM', date: '2 days ago' },
      { id: 2, from: 'host', text: "Of course! WiFi: HomeNet_Kigali | Password: Welcome2026! Let me know if it works.", time: '10:35 AM', date: '2 days ago' },
      { id: 3, from: 'guest', text: "Works perfectly, thank you!", time: '10:40 AM', date: '2 days ago' },
    ]
  },
];

const quickReplies = [
  "Check-in is at 3:00 PM. I'll send the access code closer to the date!",
  "Checkout is at 11:00 AM. Late checkout may be available — let me check!",
  "WiFi Name: HomeNet_Kigali | Password: Welcome2026!",
  "Thank you for your booking! I'm excited to host you.",
];

export function HostMessages() {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(conversations[0].messages);
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
      from: 'host',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    }]);
    setMessage('');
  };

  const filteredConvos = conversations.filter(c =>
    c.guest.toLowerCase().includes(search.toLowerCase()) ||
    c.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Messages</h1>
        <p className="text-[#717171] text-sm">Communicate with your guests in real-time.</p>
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
                  placeholder="Search conversations..."
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
                    <div className="w-11 h-11 bg-[#484848] rounded-full flex items-center justify-center text-white text-sm font-bold">{convo.avatar}</div>
                    {convo.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[#222222] font-semibold text-sm">{convo.guest}</p>
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
            {/* Chat Header */}
            <div className="p-4 border-b border-[#EBEBEB] flex items-center gap-3">
              <button onClick={() => setShowMobileChat(false)} className="md:hidden p-1 hover:bg-[#F7F7F7] rounded-lg">
                <ChevronLeft className="w-5 h-5 text-[#222222]" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 bg-[#484848] rounded-full flex items-center justify-center text-white text-sm font-bold">{activeConvo.avatar}</div>
                {activeConvo.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#222222] font-semibold text-sm">{activeConvo.guest}</p>
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

            {/* Booking Info Banner */}
            <div className="px-4 py-2 border-b border-[#EBEBEB] flex items-center gap-3" style={{ background: '#FFF8F9' }}>
              <Star className="w-4 h-4 text-[#FF385C] shrink-0" />
              <p className="text-sm text-[#484848]">
                <span className="font-semibold text-[#222222]">{activeConvo.guest}</span> has a booking checking in <span className="text-[#FF385C] font-semibold">{activeConvo.checkIn}</span>
              </p>
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
                    <div className={`flex ${msg.from === 'host' ? 'justify-end' : 'justify-start'}`}>
                      {msg.from === 'guest' && (
                        <div className="w-8 h-8 bg-[#484848] rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0">{activeConvo.avatar}</div>
                      )}
                      <div className={`max-w-[70%] ${msg.from === 'host' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div
                          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                          style={{
                            background: msg.from === 'host' ? '#FF385C' : '#F7F7F7',
                            color: msg.from === 'host' ? 'white' : '#222222',
                            borderBottomRightRadius: msg.from === 'host' ? 4 : undefined,
                            borderBottomLeftRadius: msg.from === 'guest' ? 4 : undefined,
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
                  {qr.slice(0, 40)}...
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
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full text-sm text-[#222222] outline-none bg-transparent resize-none placeholder:text-[#AAAAAA] max-h-24"
                  style={{ lineHeight: '1.5' }}
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