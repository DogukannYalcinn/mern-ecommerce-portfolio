import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import Toast from "../components/ui/Toast.tsx";

type ToastMessage = {
  id: number;
  type: "success" | "error";
  content: string;
};
type UIContextType = {
  showToast: (type: "success" | "error", content: string) => void;
};

export const UIContext = createContext<UIContextType | undefined>(undefined);

const UIContextProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const timerDuration = 3500;

  const showToast = useCallback(
    (type: "success" | "error", content: string) => {
      const id = Date.now();
      const newToast = { id, type, content };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, timerDuration);
    },
    [],
  );
  const value = useMemo(() => ({ showToast }), [showToast]);
  return (
    <UIContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.content}
          duration={timerDuration}
        />
      ))}
    </UIContext.Provider>
  );
};

export default UIContextProvider;
