import { GalleryGrid } from "./components/GalleryGrid";
import { ImageViewer } from "./components/ImageViewer";
import { HdrControls } from "./components/HdrControls";
import { getImageList } from "./images/imageList";
import { useHdrSupport } from "./hooks/useHdrSupport";
import { useHdrSettings } from "./hooks/useHdrSettings";
import { useImageNavigation } from "./hooks/useImageNavigation";

const images = getImageList();

/** ギャラリーとビューワーを切り替えるアプリケーションルート */
export const App = () => {
  const isHdrSupported = useHdrSupport();
  const { isHdrEnabled, isViewTransitionEnabled, handleHdrToggle, handleViewTransitionToggle } =
    useHdrSettings();
  const {
    selectedImage,
    selectedImageIndex,
    isNavigating,
    transitioningImageId,
    handleImageClick,
    handleCloseViewer,
    handleNavigate,
  } = useImageNavigation({ images, isViewTransitionEnabled });

  const appClassName = [
    "app",
    isHdrEnabled ? "hdr-on" : "",
    selectedImage ? "viewer-mode" : "gallery-mode",
    isViewTransitionEnabled ? "view-transition-enabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appClassName}>
      {!selectedImage && (
        <GalleryGrid
          onImageClick={handleImageClick}
          activeTransitionImageId={transitioningImageId}
          isViewTransitionEnabled={isViewTransitionEnabled}
        />
      )}

      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          imageIndex={selectedImageIndex}
          totalImages={images.length}
          onClose={handleCloseViewer}
          onNavigate={handleNavigate}
          isNavigating={isNavigating}
          isViewTransitionEnabled={isViewTransitionEnabled}
        />
      )}

      <HdrControls
        isHdrSupported={isHdrSupported}
        isHdrEnabled={isHdrEnabled}
        onToggleHdrEnabled={handleHdrToggle}
        isViewTransitionEnabled={isViewTransitionEnabled}
        onToggleViewTransition={handleViewTransitionToggle}
        isViewerMode={!!selectedImage}
      />
    </div>
  );
};
