import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(
    () => localStorage.getItem("activeUserId") || ""
  );

  useEffect(() => {
    if (userId) {
      localStorage.setItem("activeUserId", userId);
    } else {
      localStorage.removeItem("activeUserId");
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
