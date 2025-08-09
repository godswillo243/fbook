// src/context/ToastContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Toast, ToastType } from "../../types";
import { v4 as uuidv4 } from "uuid";

interface ToastContextProps {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [newToast, setNewToast] = useState<Toast>();

  useEffect(() => {
    if (!newToast) return;
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    }, 3000); // auto dismiss
  }, [toasts, newToast]);

  const showToast = (message: string, type: ToastType = "info") => {
    const newToast: Toast = {
      id: uuidv4(),
      message,
      type,
    };
    setNewToast(newToast);
    setToasts((prev) => [...prev, newToast]);
    // setTimeout(() => {
    //   setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    // }, 3000); // auto dismiss
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export { useToast, ToastProvider };
