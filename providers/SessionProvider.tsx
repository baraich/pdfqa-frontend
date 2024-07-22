"use client"
import {createContext, ReactNode, useContext, useState} from "react";

type SessionContextProps = {
  user: {
    id: number;
    email: string;
  } | null
}

type SessionProviderProps = {
  children: ReactNode
}

const SessionContext = createContext<SessionContextProps>({
  user: null
});

export default function SessionProvider({children}: SessionProviderProps) {
  const [user, setUser] =
    useState<SessionContextProps["user"]>(null);

  return (
    <SessionContext.Provider value={{user}}>
      {children}
    </SessionContext.Provider>
  )
}

// Additional Helper Utility Wrappers
type HelperUtilityWrapperProps = {
  children: ReactNode
}

export const LoggedIn = function ({ children }: HelperUtilityWrapperProps) {
  if (SessionContext === undefined) {
    throw new Error("LoggedIn can only be used inside SessionProvider.");
  }
  
  const { user } = useContext(SessionContext);
  return user !== null ? children : null;
}

export const LoggedOut = function ({ children }: HelperUtilityWrapperProps) {
  if (SessionContext === undefined) {
    throw new Error("LoggedOut can only be used inside SessionProvider.");
  }

  const { user } = useContext(SessionContext);
  return user === null ? children : null;
}
