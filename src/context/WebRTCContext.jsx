import { createContext, useContext, useEffect, useState } from "react";

export const WebRTCContext = createContext();

export const WebRTCContextProvider = ({ children }) => {
  return (
    <WebRTCContext.Provider value={{ "test": "test" }} >
      {children}
    </WebRTCContext.Provider>
  );
};
