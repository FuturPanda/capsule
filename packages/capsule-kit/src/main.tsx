import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./_utils/providers/AuthProvider";
import { ThemeProvider } from "./_utils/providers/ThemeProvider";
import { App } from "./App";
import "./styles/index.css";
import { ReactFlowProvider } from "@xyflow/react";

// register(`/service-worker.js`);

const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactFlowProvider>
            <AuthProvider>
              {/*<SyncProvider>*/}
              <App />
              {/*</SyncProvider>*/}
            </AuthProvider>
          </ReactFlowProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
