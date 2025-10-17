import { useEffect } from "react";

type KeyboardHandlers = {
  Escape?: () => void;
  ArrowLeft?: () => void;
  ArrowRight?: () => void;
};

/** キーボード入力で指定ハンドラーを呼び出すカスタムフック */
export const useKeyboard = (handlers: KeyboardHandlers) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const handler = handlers[event.key as keyof KeyboardHandlers];
      handler?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
};
