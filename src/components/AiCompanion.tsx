'use client';

import React, { useState } from 'react';
import { Language, EarningsSummary } from '@/lib/types';
import { Send, Sparkles, AlertCircle, Bot, User, CheckCircle2, RefreshCw } from 'lucide-react';

interface AiCompanionProps {
  currentLang: Language;
  earningsSummary: EarningsSummary;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiCompanion: React.FC<AiCompanionProps> = ({ currentLang, earningsSummary }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        currentLang === 'hi'
          ? 'नमस्ते! मैं आपका "काम साथी" एआई हूँ। आप मुझसे कमाई विवाद, डिलीवरी सुरक्षा, ई-श्रम या अन्य सरकारी योजनाओं के बारे में पूछ सकते हैं। मैं केवल सत्य व सत्यापित जानकारी देता हूँ।'
          : currentLang === 'hinglish'
          ? 'Namaste! Main aapka "KaamSaathi" AI companion hoon. Aap mujhse platform payout issues, delivery safety, e-Shram aur government welfare schemes ke baare mein pooch sakte hain. Main strictly honest guidance provide karta hoon.'
          : 'Namaste! I am your KaamSaathi AI companion. You can ask me about payout disputes, on-road safety, e-Shram and welfare schemes, or explaining delivery contracts. I provide honest guidance and never fabricate facts.',
      timestamp: 'Today',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const suggestedPrompts = [
    currentLang === 'hi'
      ? 'डिलीवरी में ₹500 का गलत पेनल्टी कटने पर क्या करूँ?'
      : 'How to dispute a wrong penalty deduction of ₹500?',
    currentLang === 'hi'
      ? 'ई-श्रम कार्ड से मुझे और मेरे परिवार को क्या लाभ मिलता है?'
      : 'What exact benefits do gig workers get under e-Shram?',
    currentLang === 'hi'
      ? 'रात में सुनसान जगह डिलीवरी के समय सुरक्षा नियम'
      : 'Safety protocol for late-night delivery in unmapped areas',
    currentLang === 'hi'
      ? '100cc बाइक पर प्रति किलोमीटर पेट्रोल का सही खर्च कैसे निकालें?'
      : 'How to calculate real fuel cost per km on a 110cc bike?',
  ];

  const handleSend = async (messageText?: string) => {
    const query = (messageText || input).trim();
    if (!query || isLoading) return;

    setApiError(null);
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLang,
          earningsContext: earningsSummary.shiftCount > 0 ? earningsSummary : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gemini API call failed.');
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown communication error.';
      setApiError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-lg overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>KaamSaathi AI Companion</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Verified advice • No fabricated benefits • Simple {currentLang.toUpperCase()}
            </p>
          </div>
        </div>

        {earningsSummary.shiftCount > 0 && (
          <div className="text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-emerald-400 hidden sm:flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Tracker Connected (Net: ₹{earningsSummary.netEarnings})</span>
          </div>
        )}
      </div>

      {/* API Error Notification */}
      {apiError && (
        <div className="bg-rose-950/80 border-b border-rose-500/50 p-3.5 text-xs text-rose-200 flex items-start space-x-2.5 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">AI Service Response</p>
            <p className="mt-0.5 text-rose-200/90">{apiError}</p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div
                className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                  isUser ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 ${isUser ? 'text-slate-800' : 'text-slate-400'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2.5 text-xs text-slate-400 bg-slate-800/50 border border-slate-800 rounded-xl px-4 py-2.5 w-fit">
            <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin" />
            <span>Consulting Gemini for verified guidance...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800/60 flex space-x-2 overflow-x-auto scrollbar-none">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-[11px] whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700/60 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            currentLang === 'hi'
              ? 'अपना सवाल यहाँ लिखें (उदा. ई-श्रम, पेनल्टी, रात की सुरक्षा)...'
              : 'Type your question here (e.g. penalty dispute, safety, e-Shram)...'
          }
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1"
          aria-label="Send message to AI Companion"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
