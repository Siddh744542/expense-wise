// src/app/SessionProviderWrapper.js
"use client";
import { SessionProvider } from "next-auth/react";
export default function SessionProviderWrapper({ children, session }) {
  return <SessionProvider>{children}</SessionProvider>;
}
