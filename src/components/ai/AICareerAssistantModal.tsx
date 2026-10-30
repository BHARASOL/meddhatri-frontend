import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AICareerAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICareerAssistantModal: React.FC<AICareerAssistantModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user?.name || 'Doctor'}! I am your MedDhatri AI Healthcare Career Advisor. Ask me anything about specialty compensation benchmarks, hospital medical board interviews, or optimizing your clinical profile.`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickQuestions = [
    'How can I prepare for tertiary hospital interviews?',
    'What are the 2026 salary benchmarks for my specialty?',
    'How do I highlight NABH protocols on my CV?'
  ];

  const handleSend = (textToSend?: string) => {
    const question = textToSend || input;
    if (!question.trim()) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const q = question.toLowerCase();

      if (q.includes('interview') || q.includes('prepare')) {
        reply = `**Healthcare Selection Board Strategy:**
1. **Clinical Scenarios**: Expect queries on deteriorating patients using SBAR (Situation, Background, Assessment, Recommendation).
2. **Clinical Governance**: Emphasize familiarity with hospital infection control committee (HICC) and antibiotic stewardship.
3. **Research the Hospital**: Know their bed capacity, NABH accreditations, and recent surgical milestones.`;
      } else if (q.includes('salary') || q.includes('compensation') || q.includes('benchmark')) {
        reply = `**2026 Healthcare Compensation Benchmarks (Metros):**
- **Specialist Doctors (MD/DM)**: ₹24L – ₹45L+ p.a.
- **Critical Care Staff Nurses**: ₹5.5L – ₹8.5L p.a.
- **Clinical Pharmacists (Pharm.D)**: ₹4.5L – ₹7.5L p.a.
- **Healthcare IT / Informatics Leads**: ₹18L – ₹32L p.a.`;
      } else {
        reply = `Based on your profile as ${user?.headline || 'a Healthcare Specialist'}, you have strong clinical fundamentals. To accelerate your career into leadership roles, consider adding NABH Internal Auditor certification and documenting procedural volume metrics.`;
      }

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'ai',
        text: `Hello ${user?.name || 'Doctor'}! I am your MedDhatri AI Healthcare Career Advisor. Ask me anything about specialty compensation benchmarks, hospital medical board interviews, or optimizing your clinical profile.`,
        time: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] sm:h-[600px] max-h-[92vh] animate-in fade-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#1B5F85] text-white p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-teal-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">MedDhatri AI Career Advisor</h3>
              <p className="text-[11px] text-teal-200">Context-aware healthcare mentorship</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 min-h-0">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  m.sender === 'user' ? 'bg-[#1B5F85] text-white' : 'bg-[#2DC4B4] text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#1B5F85] text-white rounded-tr-none font-medium'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-line font-normal'
                }`}
              >
                {m.text}
                <span
                  className={`block text-xs mt-1.5 ${
                    m.sender === 'user' ? 'text-slate-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pl-9 sm:pl-11">
              <span className="w-2 h-2 bg-[#2DC4B4] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#2DC4B4] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-[#2DC4B4] rounded-full animate-bounce [animation-delay:0.4s]" />
              <span>Analyzing healthcare career database...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-3 sm:px-5 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
          <span className="text-[#1B5F85] shrink-0 font-bold text-xs">Suggestions:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full bg-[#E0F7F5] hover:bg-[#2DC4B4] hover:text-white text-[#1B5F85] font-semibold transition whitespace-nowrap border border-[#2DC4B4]/30 shrink-0 cursor-pointer text-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0 pb-safe">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your career or interview question..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2DC4B4] focus:bg-white transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-[#2DC4B4] hover:bg-[#25ab9d] disabled:opacity-50 text-white p-2.5 rounded-xl shadow-sm transition cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
