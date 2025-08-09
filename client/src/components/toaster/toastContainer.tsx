// src/components/ToastContainer.tsx

import { CheckIcon, InfoIcon, TriangleAlert, XOctagonIcon } from "lucide-react";
import { useToast } from "./context";

const toastStyles = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500 text-black",
};

const toastIcons = {
  success: CheckIcon,
  error: XOctagonIcon,
  info: InfoIcon,
  warning: TriangleAlert,
};
export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((toast) => {
        const ToastIcon = toastIcons[toast.type];
        return (
          <div key={toast.id} className={`alert text-white! ${toastStyles[toast.type]}`}>
            <ToastIcon />

            <p>{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};

//{
/* <div role="alert" className="alert">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="stroke-info h-6 w-6 shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
  <span>12 unread messages. Tap to see.</span>
</div>; */
//}
