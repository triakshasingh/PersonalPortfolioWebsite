"use client";

import * as Toast from "@radix-ui/react-toast";
import { useCallback, useState } from "react";
import { createContext, useContext, ReactNode } from "react";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { showToast: () => {} };
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="rounded-xl border border-[#1A1A2E] bg-[#111118] px-4 py-3 shadow-xl"
        >
          <Toast.Title className="text-sm font-medium text-[#F8F8FF]">
            {message}
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
