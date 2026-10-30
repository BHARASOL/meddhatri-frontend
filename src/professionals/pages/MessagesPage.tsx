import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import apiClient from '../../api/client.js';
import { 
  Send, 
  Search, 
  Building2, 
  User, 
  CheckCheck, 
  Paperclip, 
  ArrowLeft, 
  MoreVertical,
  ShieldCheck, 
  Video, 
  Phone, 
  Sparkles,
  Loader2
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  receiverId?: string;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/conversations');
      if (res.success && Array.isArray(res.data)) {
        const formatted: Contact[] = res.data.map((c: any) => {
          const other = c.otherParticipant || {};
          return {
            id: c.id || c._id,
            name: other.name || 'Hospital Recruitment Team',
            role: other.role === 'ORGANIZATION_ADMIN' ? 'Hospital Medical Board' : 'Talent Coordinator',
            organization: other.organizationName || 'Accredited Healthcare Partner',
            avatar: other.avatar || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&auto=format&fit=crop&q=80',
            lastMessage: c.lastMessage || 'Direct inquiry regarding clinical vacancy',
            time: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            unread: 0,
            online: true,
            receiverId: other.id || other._id
          };
        });
        setContacts(formatted);
        if (formatted.length > 0 && !activeContact) {
          handleSelectContact(formatted[0]);
        }
      }
    } catch (err) {
      console.warn('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = async (c: Contact) => {
    setActiveContact(c);
    setShowMobileChat(true);
    try {
      const res = await apiClient.get(`/conversations/${c.id}/messages`);
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data.map((m: any) => ({
          id: m.id || m._id,
          sender: (m.sender_id || m.senderId) === (user?.id || user?._id) ? 'me' : 'them',
          text: m.content,
          time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
        })));
      }
    } catch (err) {
      console.warn('Error loading messages for conversation:', err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeContact) return;

    const messageText = input.trim();
    setInput('');

    const optimistic: Message = {
      id: `temp_${Date.now()}`,
      sender: 'me',
      text: messageText,
      time: 'Just now'
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      await apiClient.post('/messages', {
        conversationId: activeContact.id,
        receiverId: activeContact.receiverId,
        content: messageText
      });
    } catch (err) {
      console.error('Failed to send message to hospital board:', err);
    }
  };

  return (
    <div className="h-[80vh] sm:h-[78vh] bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-subtle overflow-hidden flex flex-col md:flex-row">
      {/* Contact List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-black text-sm text-[#1B5F85]">Hospital Recruiters & Panels</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Verified Channel
            </span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals or interviewers..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/30 focus:border-[#1B5F85]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2 my-auto">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-1" />
              <p className="font-bold text-slate-600">No recruiter messages yet</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hospital recruiters will connect here directly when reviewing your applications or scheduling interviews.
              </p>
            </div>
          ) : (
            filteredContacts.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectContact(c)}
                className={`w-full p-3.5 sm:p-4 text-left flex items-start gap-3 transition cursor-pointer ${
                  activeContact?.id === c.id 
                    ? 'bg-teal-50/70 border-l-4 border-[#1B5F85]' 
                    : 'hover:bg-slate-100/70'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80';
                    }}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  {c.online && (
                    <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-black text-xs text-[#1B5F85] truncate">{c.name}</h4>
                    <span className="text-[11px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-teal-800 truncate">{c.role}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Thread */}
      <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeContact ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2 bg-slate-50/30">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#1B5F85] flex items-center justify-center mb-1 shadow-2xs">
              <Sparkles className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-700">Encrypted Clinical Communication Channel</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Select an inquiry or panel from the sidebar to discuss vacancy specifications, credential reviews, and interview coordination.
            </p>
          </div>
        ) : (
          <>
            {/* Top Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg transition shrink-0 cursor-pointer"
                  aria-label="Back to contacts"
                >
                  <ArrowLeft className="w-5 h-5 text-[#1B5F85]" />
                </button>

                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80';
                  }}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-[#1B5F85] truncate">{activeContact.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {activeContact.organization}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">{activeContact.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> MedDhatri Secured
                </span>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              <div className="text-center my-2">
                <span className="text-[11px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                  End-to-End Encrypted Clinical Conversation
                </span>
              </div>

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      m.sender === 'me'
                        ? 'bg-gradient-to-r from-[#1B5F85] to-[#154E70] text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-normal'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className={`block text-[10px] mt-1.5 ${m.sender === 'me' ? 'text-teal-200 text-right' : 'text-slate-400'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message to hospital talent panel..."
                className="flex-1 bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/30 focus:border-[#1B5F85]"
              />
              <button
                type="submit"
                className="bg-[#1B5F85] hover:bg-[#154E70] text-white p-2.5 sm:p-3 rounded-xl transition shrink-0 cursor-pointer shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
