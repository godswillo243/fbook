
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastContainer } from "./components/toaster/toastContainer.tsx";
import { ToastProvider } from "./components/toaster/context.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </>
);
