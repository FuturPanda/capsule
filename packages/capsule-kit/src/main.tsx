import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { CapsuleClientProvider } from "./_utils/providers/CapsuleClientProvider";
import { ThemeProvider } from "./_utils/providers/ThemeProvider";
import { App } from "./App";
import "./styles/index.css";

// register(`/service-worker.js`);

const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <CapsuleClientProvider>
            <App />
          </CapsuleClientProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
