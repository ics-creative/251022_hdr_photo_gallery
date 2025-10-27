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
  } = useImageNavigation({ images });

  const appClassName = [
    "app",
    isHdrEnabled ? "hdr-on" : "",
    selectedImage ? "viewer-mode" : "gallery-mode",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appClassName}>
      {!selectedImage && (
        <GalleryGrid
          onImageClick={handleImageClick}
          activeTransitionImageId={transitioningImageId}
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
