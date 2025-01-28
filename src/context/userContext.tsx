'use client';

import React, { createContext, useContext, useState } from 'react';

interface UserDetails {
  userId: string;
  serverId: string;
  username: string;
  customerName: string;
  whatsapp: string;
  email: string;
}

interface UserContextType {
  userDetails: UserDetails | null;
  setUserDetails: (details: UserDetails) => void;
  clearUserDetails: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const clearUserDetails = () => {
    setUserDetails(null);
  };

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, clearUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
