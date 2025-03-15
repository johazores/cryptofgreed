interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  // Prevent background scrolling when modal is open
  if (typeof document !== "undefined") {
    document.body.style.overflow = "hidden";
  }

  // Cleanup function to restore scrolling when modal closes
  const handleClose = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        // Remove onClick from backdrop to prevent unwanted closing
      />
      <div
        className={`relative bg-white rounded-xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full mx-4 max-h-[80vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}
