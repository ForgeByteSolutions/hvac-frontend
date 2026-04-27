import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import { useAgent } from '../../hooks/useAgent';
import { useChatContext } from '../../context/ChatContext';

export default function AgentChatUI() {
  const [input, setInput] = useState('');
  const { conversation, recommendations } = useChatContext();
  const { sendMessage, isLoading } = useAgent();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, isLoading, recommendations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const showEmptyState = conversation.length === 0;

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto relative relative">
      
      {/* Scrollable Message Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-32 pt-8 flex flex-col gap-6">
        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-80 mt-12">
            <div className="w-16 h-16 bg-apple-blue/10 rounded-3xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">How can I help with your HVAC needs?</h2>
            <p className="text-apple-gray max-w-md mx-auto text-[15px]">
              Describe what kind of heating or cooling you're looking for, or just tell me about your home.
            </p>
          </div>
        ) : (
          conversation.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))
        )}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={bottomRef} />
      </div>

      {/* Floating Input Area */}
      {/* Hide input if recommendations have been generated to focus on results */}
      {!recommendations && (
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <form 
            onSubmit={handleSubmit}
            className="relative glass-dark p-2 pl-6 rounded-full flex items-center shadow-xl max-w-2xl mx-auto border border-black/5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your HVAC needs..."
              className="flex-1 bg-transparent text-white border-none outline-none text-[15px] placeholder:text-gray-400 py-2.5"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: input.trim() ? '#0066cc' : '#f5f5f7',
                color: input.trim() ? 'white' : '#86868b',
                transform: input.trim() ? 'scale(1)' : 'scale(0.95)'
              }}
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          </form>
          <div className="text-center mt-3 text-[12px] text-apple-gray font-medium opacity-70">
            Aura AI can make mistakes. Verify important specs.
          </div>
        </div>
      )}
    </div>
  );
}
