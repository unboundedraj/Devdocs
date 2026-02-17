'use client';

import { useState, useRef, useEffect } from 'react';
import { Vortex } from '@/components/ui/vortex';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message on client side only to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! 👋 I\'m the DevDocs AI Assistant. How can I help you today? You can ask me about applications, documentation, contributing, or anything else related to DevDocs.',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only scroll when new messages are added after initial load
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call the API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What is DevDocs?",
    "How do I contribute?",
    "Show me applications",
    "Get support"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <main className="min-h-screen bg-theme-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-secondary)] rounded-full opacity-10 blur-3xl animate-float-delayed"></div>
      </div>

      {/* Fixed Vortex Background */}
      <div className="fixed inset-0 z-0">
        <Vortex backgroundColor="black" containerClassName="w-full h-full" className="w-full h-full" />
      </div>

      {/* Header - Scrollable Content */}
      <div className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30 flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">DevDocs AI Assistant</h1>
              <p className="text-white/90 text-base md:text-lg">Powered by Llama 3.3 70B</p>
            </div>
          </div>
          {error && (
            <div className="mt-6 text-sm text-red-100 bg-red-500/30 px-4 py-3 rounded-lg border border-red-300/50 backdrop-blur-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col p-6">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 scrollbar-thin scrollbar-thumb-[var(--color-primary)] scrollbar-track-transparent">
          {mounted && messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md ${
                  message.role === 'user' 
                    ? 'bg-theme-secondary' 
                    : 'bg-theme-primary'
                }`}>
                  {message.role === 'user' ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>

                {/* Message bubble */}
                <div className={`px-4 py-3 rounded-2xl shadow-md ${
                  message.role === 'user'
                    ? 'bg-theme-secondary text-white'
                    : 'bg-theme-card text-theme-secondary border border-theme'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  
                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-white opacity-75' : 'text-theme-secondary'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Quick prompts (show only when no messages except welcome) */}
          {mounted && messages.length === 1 && (
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-theme-secondary text-sm text-center mb-4">Try asking:</p>
              <div className="grid grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-4 py-3 rounded-xl bg-theme-card hover:bg-theme-background border border-theme hover:border-[var(--color-primary)] text-theme-secondary text-sm transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-primary flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="bg-theme-card text-theme-secondary border border-theme px-4 py-3 rounded-2xl shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about DevDocs..."
              disabled={isLoading}
              className="w-full px-6 py-4 bg-theme-card border border-theme rounded-2xl text-theme-secondary placeholder-theme-secondary focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50 disabled:opacity-50 transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 py-4 bg-theme-primary hover:opacity-90 disabled:opacity-50 text-white rounded-2xl font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Thinking...
              </>
            ) : (
              <>
                Send
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}