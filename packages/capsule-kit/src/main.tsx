import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { register } from "register-service-worker";
import { AuthProvider } from "./_utils/providers/AuthProvider";
import { StoreProvider } from "./_utils/providers/StoreProvider";
import { ThemeProvider } from "./_utils/providers/ThemeProvider";
import { App } from "./App";
import { RootStore } from "./stores/root.store";
import "./styles/index.css";

register(`/service-worker.js`);

const queryClient = new QueryClient();
const rootStore = new RootStore();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <StoreProvider rootStore={rootStore}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </QueryClientProvider>
        </StoreProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
