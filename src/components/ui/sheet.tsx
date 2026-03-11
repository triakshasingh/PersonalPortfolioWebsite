import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

type SheetContentProps = React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  side?: "right" | "left";
};

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = "right", ...props }, ref) => {
    return (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
        <Dialog.Content
          ref={ref}
          className={cn(
            "fixed z-50 h-full w-full sm:w-[520px] bg-[#0B0B12] border-l border-[#1A1A2E] shadow-2xl px-6 py-7 focus:outline-none transition-transform duration-300 data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full",
            side === "left" &&
              "border-l-0 border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
            className,
          )}
          {...props}
        >
          <SheetClose asChild>
            <button
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#111118] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              aria-label="Close panel"
            >
              <X size={18} />
            </button>
          </SheetClose>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    );
  },
);
SheetContent.displayName = "SheetContent";
