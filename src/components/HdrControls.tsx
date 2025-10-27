import { type ChangeEvent } from "react";
import "./HdrControls.css";

interface HdrControlsProps {
  isHdrSupported: boolean | null;
  isHdrEnabled: boolean;
  isViewTransitionEnabled: boolean;
  onToggleHdrEnabled: (enabled: boolean) => void;
  onToggleViewTransition: (enabled: boolean) => void;
  isViewerMode: boolean; // 詳細画面かどうか
}

/** HDR表示の有効・無効とサポート状況を管理するUI */
export const HdrControls = ({
  isHdrSupported,
  isHdrEnabled,
  onToggleHdrEnabled,
  isViewTransitionEnabled,
  onToggleViewTransition,
  isViewerMode,
}: HdrControlsProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onToggleHdrEnabled(event.target.checked);
  };

  const handleViewTransitionChange = (event: ChangeEvent<HTMLInputElement>) => {
    onToggleViewTransition(event.target.checked);
  };

  return (
    <aside className="hdr-controls">
      {isViewerMode && (
        <label className="hdr-switch">
          <input
            id="hdr-toggle"
            type="checkbox"
            switch=""
            checked={isHdrEnabled}
            onChange={handleChange}
          />
          <span className="hdr-switch__label">HDR</span>
        </label>
      )}

      <label className="hdr-switch">
        <input
          id="view-transition-toggle"
          type="checkbox"
          switch=""
          checked={isViewTransitionEnabled}
          onChange={handleViewTransitionChange}
        />
        <span className="hdr-switch__label">ビュー遷移演出</span>
      </label>

      <p className="hdr-support">{isViewerMode && isHdrEnabled ? "no-limit" : "standard"}</p>

      {!isHdrSupported && isHdrEnabled && (
        <p className="hdr-warning">HDR未対応のためHDR表示にはなりません。</p>
      )}
    </aside>
  );
};
