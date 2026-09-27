import React, { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const loginLocal = (u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem("user"); };
  return <Ctx.Provider value={{ user, loginLocal, logout }}>{children}</Ctx.Provider>;
}

export function useUser() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
