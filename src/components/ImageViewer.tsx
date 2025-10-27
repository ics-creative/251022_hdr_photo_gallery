import { useEffect, useState } from "react";
import { type ImageInfo } from "../images/imageList";
import { DETAIL_VIEWER_TRANSITION_NAME } from "../animations/viewTransitions";
import { useKeyboard } from "../hooks/useKeyboard";
import "./ImageViewer.css";
import { formatPhotoMetadata } from "../metadata/formatter";
import { loadPhotoMetadata } from "../metadata/loader";

interface ImageViewerProps {
  image: ImageInfo;
  imageIndex: number;
  totalImages: number;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  isNavigating: boolean;
  isViewTransitionEnabled: boolean;
}

/** 詳細ビューとして画像を拡大表示するコンポーネント */
export const ImageViewer = ({
  image,
  imageIndex,
  totalImages,
  onClose,
  onNavigate,
  isNavigating,
  isViewTransitionEnabled,
}: ImageViewerProps) => {
  useKeyboard({
    Escape: onClose,
    ArrowLeft: () => onNavigate("prev"),
    ArrowRight: () => onNavigate("next"),
  });

  const [metadataSummary, setMetadataSummary] = useState("");

  useEffect(() => {
    let cancelled = false;

    setMetadataSummary("");

    const loadMetadata = async () => {
      try {
        const metadata = await loadPhotoMetadata(image.path);
        if (!cancelled) {
          setMetadataSummary(formatPhotoMetadata(metadata));
        }
      } catch {
        if (!cancelled) {
          setMetadataSummary("");
        }
      }
    };

    void loadMetadata();

    return () => {
      cancelled = true;
    };
  }, [image.path]);

  // isViewTransitionEnabledがtrueの場合のみ view-transition-name を設定
  const transitionStyle = isViewTransitionEnabled
    ? { viewTransitionName: DETAIL_VIEWER_TRANSITION_NAME }
    : undefined;

  const isPrevDisabled = imageIndex === 0 || isNavigating;
  const isNextDisabled = imageIndex === totalImages - 1 || isNavigating;

  return (
    <div className="image-viewer">
      <div className="viewer-stage">
        <img src={image.path} alt="" className="main-image" style={transitionStyle} />
      </div>

      <div className="viewer-controls">
        <button
          className={`nav-button prev ${isPrevDisabled ? "disabled" : ""}`}
          onClick={() => onNavigate("prev")}
          disabled={isPrevDisabled}
          aria-label="前の画像"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M14.5 5 8 12l6.5 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          className={`nav-button next ${isNextDisabled ? "disabled" : ""}`}
          onClick={() => onNavigate("next")}
          disabled={isNextDisabled}
          aria-label="次の画像"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M9.5 5 16 12l-6.5 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button className="close-button" onClick={onClose} aria-label="閉じる">
          <span className="close-icon" aria-hidden="true">
            ✕
          </span>
        </button>
      </div>

      {metadataSummary && (
        <div className="image-metadata" aria-label="撮影情報">
          {metadataSummary}
        </div>
      )}
    </div>
  );
};
