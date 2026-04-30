import { useState } from 'react';
import { HvacAPI } from '../services/api';
import { useContractorContext } from '../context/ContractorContext';

export const useContractorAgent = () => {
  const {
    conversation,
    setConversation,
    productContext,
    setSystemConfigs,
    setLastAction,
  } = useContractorContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (content) => {
    if (!content.trim() || !productContext) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1. Optimistic UI — add user message immediately
      const userMessage = { role: 'user', content };
      const updatedHistory = [...conversation, userMessage];
      setConversation(updatedHistory);

      // 2. Call contractor advisor API with product context + conversation
      const response = await HvacAPI.contractorAdvise(productContext, updatedHistory);

      // 3. Build assistant message text based on action type
      let assistantText = response.message || '';
      const action = response.action;

      // Add a contextual assistant message to the conversation
      const agentMessage = { role: 'assistant', content: assistantText, actionData: response };
      setConversation((prev) => [...prev, agentMessage]);

      // 4. Save structured data for UI components
      setLastAction(response);

      if (action === 'system_build') {
        setSystemConfigs(response.configs || []);
      }

    } catch (err) {
      console.error('[Contractor Agent Error]', err);
      setError(err.message || 'Failed to get response from AI advisor.');
      // Remove optimistic message on failure
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
