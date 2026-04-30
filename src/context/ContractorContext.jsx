import React, { createContext, useContext, useState } from 'react';

const ContractorContext = createContext();

export const useContractorContext = () => useContext(ContractorContext);

export const ContractorProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const [productContext, setProductContext] = useState(null);
  const [systemConfigs, setSystemConfigs] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanelWithProduct = (product) => {
    setProductContext(product);
    setIsPanelOpen(true);
    // Reset conversation when switching products
    if (!productContext || productContext.product_id !== product.product_id) {
      setConversation([]);
      setSystemConfigs(null);
      setSelectedConfig(null);
      setLastAction(null);
    }
  };

  const resetContractor = () => {
    setConversation([]);
    setSystemConfigs(null);
    setSelectedConfig(null);
    setLastAction(null);
  };

  return (
    <ContractorContext.Provider
      value={{
        conversation,
        setConversation,
        productContext,
        setProductContext,
        systemConfigs,
        setSystemConfigs,
        selectedConfig,
        setSelectedConfig,
        lastAction,
        setLastAction,
        isPanelOpen,
        setIsPanelOpen,
        openPanelWithProduct,
        resetContractor,
      }}
    >
      {children}
    </ContractorContext.Provider>
  );
};
