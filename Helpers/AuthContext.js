import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [triggerIt, settriggerIt] = useState(false);  

  return (
    <AuthContext.Provider value={{ triggerIt, settriggerIt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
