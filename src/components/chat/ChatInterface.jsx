// components/chat/ChatInterface.jsx
import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  AlertTriangle,
  Check,
  CheckCheck,
  Clock,
  User,
  ChevronLeft,
  Search,
  MoreVertical,
  Shield,
  X
} from 'lucide-react';

export default function ChatInterface({
  conversations = [],
  currentUser,
  onSendMessage,
  messages = [],
  typingUser,
  error,
  onBack
}) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedChat) return;

    // Check for contact info
    const contactPatterns = {
      phone: /\b\d{10,}\b|[\d]{3}[-.]?[\d]{3}[-.]?[\d]{4}/,
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    };

    const hasContactInfo = contactPatterns.phone.test(messageText) || 
                          contactPatterns.email.test(messageText);

    if (hasContactInfo) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      return;
    }

    onSendMessage?.(selectedChat.id, selectedChat.recipientId, messageText);
    setMessageText('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-[#F5F4F0] rounded-xl overflow-hidden border border-[#E2E0D9]">
      {/* Conversation List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] flex-col bg-white border-r border-[#E2E0D9]`}>
        {/* Header */}
        <div className="p-4 border-b border-[#E2E0D9]">
          <h2 className="text-[16px] font-semibold font-['Space_Grotesk',sans-serif] mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-[#E2E0D9] pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-[#1E7A34] bg-[#FAFAF8]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageCircle className="h-8 w-8 text-[#D8D5CB] mb-3" />
              <p className="text-[13px] font-medium text-[#55605A]">No conversations yet</p>
              <p className="text-[12px] text-[#9A9488] mt-1">Start chatting with a professional</p>
            </div>
          ) : (
            filteredConversations.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-[#F7F6F2] transition-colors border-b border-[#E2E0D9] ${
                  selectedChat?.id === chat.id ? 'bg-[#F7F6F2] border-l-[3px] border-l-[#1E7A34]' : ''
                }`}
              >
                <div className="relative">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E7A34] to-[#166B2C] text-[14px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
                    {chat.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#1E7A34] border-2 border-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold text-[#1E2420]">{chat.name}</p>
                    <span className="shrink-0 text-[11px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="truncate text-[12px] text-[#55605A]">{chat.lastMessage || 'Start a conversation'}</p>
                    {chat.unread && (
                      <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#F0821E] text-[10px] font-bold text-white">
                        {chat.unreadCount || 1}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#FAFAF8]`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#E2E0D9]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden rounded-lg p-1.5 hover:bg-[#F7F6F2] transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-[#55605A]" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1E7A34] to-[#166B2C] text-[13px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
                  {selectedChat.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1E2420]">{selectedChat.name}</p>
                  <p className="text-[11px] text-[#9A9488]">
                    {typingUser ? 'Typing...' : selectedChat.trade || 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F6F2] text-[11px] text-[#9A9488]">
                  <Shield className="h-3 w-3" />
                  Secure chat
                </div>
                <button className="rounded-lg p-2 hover:bg-[#F7F6F2] transition-colors">
                  <MoreVertical className="h-4 w-4 text-[#55605A]" />
                </button>
              </div>
            </div>

            {/* Safety Warning Banner */}
            <div className="px-5 py-2 bg-[#FFF8F0] border-b border-[#F0821E]/10">
              <div className="flex items-center gap-2 text-[11px] text-[#B85E10]">
                <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  For your safety, keep all communication on the platform. Sharing contact details is not allowed.
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFEDE6] mb-4">
                    <Shield className="h-8 w-8 text-[#9A9488]" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#1E2420]">Secure conversation</p>
                  <p className="text-[12px] text-[#9A9488] mt-1 max-w-[300px]">
                    Messages are monitored to prevent sharing of personal contact information
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.sender === currentUser?.id;
                  return (
                    <div key={msg.id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${isMine ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl px-4 py-2.5 ${
                          isMine 
                            ? 'bg-[#1E7A34] text-white rounded-br-md' 
                            : 'bg-white border border-[#E2E0D9] rounded-bl-md shadow-sm'
                        }`}>
                          <p className="text-[14px] leading-relaxed">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                            {new Date(msg.createdAt || msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && (
                            msg.read ? <CheckCheck className="h-3 w-3 text-[#1E7A34]" /> :
                            msg.delivered ? <CheckCheck className="h-3 w-3 text-[#9A9488]" /> :
                            <Check className="h-3 w-3 text-[#9A9488]" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Typing Indicator */}
              {typingUser && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E2E0D9] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-[#9A9488] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-[#9A9488] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-[#9A9488] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Error/Warning Toast */}
            {showWarning && (
              <div className="mx-5 mb-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3 animate-slideUp">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-red-700">Contact Information Detected</p>
                  <p className="text-[12px] text-red-600 mt-0.5">
                    Sharing phone numbers, emails, or external contacts is not allowed on 9jaTradiesPages.
                  </p>
                </div>
                <button onClick={() => setShowWarning(false)} className="flex-shrink-0">
                  <X className="h-4 w-4 text-red-400" />
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-[#E2E0D9]">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message... (no contact info)"
                    rows={1}
                    className="w-full rounded-xl border border-[#E2E0D9] px-4 py-3 pr-12 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20 resize-none bg-[#FAFAF8]"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-1">
                    <span className="text-[10px] text-[#9A9488]">
                      {messageText.length}/500
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="flex-shrink-0 rounded-xl bg-[#1E7A34] p-3 text-white hover:bg-[#166B2C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="h-3 w-3 text-[#9A9488]" />
                <p className="text-[10px] text-[#9A9488]">
                  Messages are encrypted and monitored. Phone numbers, emails, and contacts are automatically blocked.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EFEDE6] mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-[#9A9488]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
                Your Messages
              </h3>
              <p className="text-[14px] text-[#55605A] mt-2 max-w-[300px]">
                Select a conversation to start chatting. All messages are secure and monitored for your safety.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[12px] text-[#9A9488]">
                <Shield className="h-4 w-4" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}