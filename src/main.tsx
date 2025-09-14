import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

import "./index.css";
import App from "./App.tsx";
import { ToasterProvider } from "./provider/toast-provider.tsx";

console.log("🚀 Main: Starting app initialization");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Main: Root element not found!");
  throw new Error("Root element not found");
}

console.log("🚀 Main: Root element found, creating React root");

const root = createRoot(rootElement);

console.log("🚀 Main: Rendering app with providers");

root.render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
        <ToasterProvider />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);

console.log("✅ Main: App rendered successfully");
