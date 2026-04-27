import { useState } from 'react';
import { HvacAPI } from '../services/api';
import { useChatContext } from '../context/ChatContext';

export const useAgent = () => {
  const { 
    conversation, 
    setConversation, 
    setRecommendations, 
    setParsedRequirements 
  } = useChatContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1. Optimistic UI update (add user message)
      const userMessage = { role: 'user', content };
      const updatedHistory = [...conversation, userMessage];
      setConversation(updatedHistory);

      // 2. Call the agent API
      const response = await HvacAPI.recommend(updatedHistory);

      if (response.action === 'ask_question') {
        const agentMessage = { role: 'assistant', content: response.message };
        setConversation((prev) => [...prev, agentMessage]);
      } else if (response.action === 'recommend') {
        const agentMessage = { role: 'assistant', content: response.message };
        setConversation((prev) => [...prev, agentMessage]);
        
        // Save the structured data
        setParsedRequirements(response.parsed_requirements);
        setRecommendations(response.recommendations);

        // Fetch detailed explanation for recommendations
        try {
          const explainRes = await HvacAPI.explainRecommendation({
            conversation: updatedHistory,
            products: response.recommendations
          });
          if (explainRes.explanation) {
             setConversation((prev) => [...prev, { role: 'assistant', content: explainRes.explanation }]);
          }
        } catch (explainErr) {
          console.error("Failed to fetch explanation:", explainErr);
        }
      }

    } catch (err) {
      console.error("Agent error:", err);
      setError(err.message || 'An error occurred talking to the agent.');
      // Remove the optimistic message if it failed
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
};
