import { type ChangeEvent, useEffect, useRef } from "react";
import "./HdrControls.css";

interface HdrControlsProps {
  isHdrSupported: boolean | null;
  isHdrEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isViewTransitionEnabled: boolean;
  onToggleViewTransition: (enabled: boolean) => void;
}

/** HDR表示の有効・無効とサポート状況を管理するUI */
export const HdrControls = ({
  isHdrSupported,
  isHdrEnabled,
  onToggle,
  isViewTransitionEnabled,
  onToggleViewTransition,
}: HdrControlsProps) => {
  const supportLabel = (() => {
    if (isHdrSupported === null) {
      return "HDR対応を判定しています…";
    }
    return isHdrSupported ? "HDR対応ディスプレイ" : "HDR非対応ディスプレイ";
  })();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked);
  };

  const checkboxRef = useRef<HTMLInputElement>(null);
  const viewTransitionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputs = [checkboxRef.current, viewTransitionRef.current];
    inputs.forEach((input) => {
      if (input) {
        input.setAttribute("switch", "");
      }
    });
  }, []);

  const handleViewTransitionChange = (event: ChangeEvent<HTMLInputElement>) => {
    onToggleViewTransition(event.target.checked);
  };

  return (
    <aside className="hdr-controls" aria-live="polite">
      <label className="hdr-switch">
        <span className="hdr-switch__label">HDR</span>
        <input
          id="hdr-toggle"
          type="checkbox"
          ref={checkboxRef}
          checked={isHdrEnabled}
          onChange={handleChange}
        />
      </label>

      <label className="hdr-switch">
        <span className="hdr-switch__label">ビュー遷移演出</span>
        <input
          id="view-transition-toggle"
          type="checkbox"
          ref={viewTransitionRef}
          checked={isViewTransitionEnabled}
          onChange={handleViewTransitionChange}
        />
      </label>

      <p className="hdr-support">{supportLabel}</p>

      {!isHdrSupported && isHdrEnabled && (
        <p className="hdr-warning">HDR未対応のためHDR表示にはなりません。</p>
      )}
    </aside>
  );
};
