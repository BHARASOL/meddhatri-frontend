import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar.js';
import { Footer } from '../common/Footer.js';
import { AICareerAssistantModal } from '../ai/AICareerAssistantModal.js';
import { Sparkles, Bot } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  React.useEffect(() => {
    document.title = 'MedDhatri AI | Intelligent Healthcare Career & Talent Marketplace';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] w-full max-w-[100vw] overflow-x-clip">
      <Navbar />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-clip pt-0">
        <Outlet />
      </main>
      <Footer />

      {/* Floating AI Assistant Trigger matching Mockup */}
      <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setAiModalOpen(true)}
          className="bg-[#127A76] hover:bg-[#0F6A66] text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-[0_6px_25px_rgba(18,122,118,0.45)] active:scale-95 transition-all duration-200 flex items-center gap-2.5 group ring-1 ring-teal-300/40 cursor-pointer"
          title="MedDhatri AI Healthcare Career Advisor"
          aria-label="Open AI Career Assistant Chatbot"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-teal-800/70 shrink-0">
            <Bot className="w-4 h-4 text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-[11px] sm:text-xs leading-tight tracking-tight text-white flex items-center gap-1">
              AI Advisor
            </span>
            <span className="text-[9px] text-teal-200 leading-tight font-medium">Healthcare Career Bot</span>
          </div>
        </button>
      </div>

      <AICareerAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
};

