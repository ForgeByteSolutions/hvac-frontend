import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [parsedRequirements, setParsedRequirements] = useState(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const resetChat = () => {
    setConversation([]);
    setRecommendations(null);
    setParsedRequirements(null);
    setIsWidgetOpen(false);
  };

  return (
    <ChatContext.Provider
      value={{
        conversation,
        setConversation,
        recommendations,
        setRecommendations,
        parsedRequirements,
        setParsedRequirements,
        isWidgetOpen,
        setIsWidgetOpen,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
