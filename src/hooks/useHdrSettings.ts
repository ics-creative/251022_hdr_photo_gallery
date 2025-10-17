import { useState } from "react";
import {
  enabledViewTransition as initialViewTransitionEnabled,
  setEnabledViewTransition,
} from "../animations/viewTransitions";

interface UseHdrSettingsReturn {
  isHdrEnabled: boolean;
  isViewTransitionEnabled: boolean;
  handleHdrToggle: (enabled: boolean) => void;
  handleViewTransitionToggle: (enabled: boolean) => void;
}

/** HDR設定とビュー遷移設定を管理するカスタムフック */
export const useHdrSettings = (): UseHdrSettingsReturn => {
  const [isHdrEnabled, setIsHdrEnabled] = useState(true);
  const [isViewTransitionEnabled, setIsViewTransitionEnabled] = useState(
    initialViewTransitionEnabled,
  );

  const handleHdrToggle = (enabled: boolean) => {
    setIsHdrEnabled(enabled);
  };

  const handleViewTransitionToggle = (enabled: boolean) => {
    setIsViewTransitionEnabled(enabled);
    setEnabledViewTransition(enabled);
  };

  return {
    isHdrEnabled,
    isViewTransitionEnabled,
    handleHdrToggle,
    handleViewTransitionToggle,
  };
};
