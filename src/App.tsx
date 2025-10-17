import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { GalleryGrid } from "./components/GalleryGrid";
import { ImageViewer } from "./components/ImageViewer";
import { HdrControls } from "./components/HdrControls";
import { getImageList, type ImageInfo } from "./images/imageList";
import {
  startDetailImageTransition,
  startViewTransition,
  enabledViewTransition as initialViewTransitionEnabled,
  setEnabledViewTransition,
} from "./animations/viewTransitions";

const images = getImageList();

const HDR_MEDIA_QUERIES: readonly string[] = [
  "(dynamic-range: high)",
  "(color-gamut: rec2020)",
  "(color-gamut: p3)",
];

const isHDRCapable = () => {
  const supportsWideGamut = HDR_MEDIA_QUERIES.some((query) => window.matchMedia(query).matches);
  if (supportsWideGamut) return true;

  const depth = window.screen?.colorDepth ?? window.screen?.pixelDepth ?? 24;
  return depth >= 30;
};

/** ギャラリーとビューワーを切り替えるアプリケーションルート */
export const App = () => {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isHdrSupported, setIsHdrSupported] = useState<boolean | null>(null);
  const [isHdrEnabled, setIsHdrEnabled] = useState(true);
  const [isViewTransitionEnabled, setIsViewTransitionEnabled] = useState(
    initialViewTransitionEnabled,
  );
  const [transitioningImageId, setTransitioningImageId] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const updateHdrSupport = () => {
      setIsHdrSupported(isHDRCapable());
    };

    updateHdrSupport();

    const mediaQueries = HDR_MEDIA_QUERIES.map((query) => window.matchMedia(query));
    mediaQueries.forEach((query) => query.addEventListener("change", updateHdrSupport));
    return () => {
      mediaQueries.forEach((query) => query.removeEventListener("change", updateHdrSupport));
    };
  }, []);

  const handleImageClick = async (image: ImageInfo, index: number) => {
    scrollPositionRef.current = window.scrollY;

    flushSync(() => {
      setTransitioningImageId(image.id);
    });

    const transition = startViewTransition(() => {
      setSelectedImage(image);
      setSelectedImageIndex(index);
      setIsNavigating(false);
    });

    try {
      await transition.finished;
    } catch {
      // no-op
    } finally {
      setTransitioningImageId((currentId) => (currentId === image.id ? null : currentId));
    }
  };

  const handleCloseViewer = async () => {
    if (!selectedImage) {
      return;
    }

    const closingImageId = selectedImage.id;
    const previousScrollPosition = scrollPositionRef.current;

    flushSync(() => {
      setTransitioningImageId(closingImageId);
    });

    const transition = startViewTransition(() => {
      setSelectedImage(null);
      setIsNavigating(false);
    });

    window.scrollTo({ top: previousScrollPosition });

    try {
      await transition.finished;
    } catch {
      // no-op
    } finally {
      setTransitioningImageId((currentId) => (currentId === closingImageId ? null : currentId));
    }
  };

  const handleNavigate = async (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, selectedImageIndex - 1)
        : Math.min(images.length - 1, selectedImageIndex + 1);

    if (newIndex === selectedImageIndex) return;

    setIsNavigating(true);
    const transition = startDetailImageTransition(direction, () => {
      setSelectedImageIndex(newIndex);
      setSelectedImage(images[newIndex]);
    });

    try {
      await transition.finished;
    } catch {
      // no-op
    } finally {
      setIsNavigating(false);
    }
  };

  const handleHdrToggle = (enabled: boolean) => {
    setIsHdrEnabled(enabled);
  };

  const handleViewTransitionToggle = (enabled: boolean) => {
    setIsViewTransitionEnabled(enabled);
    setEnabledViewTransition(enabled);
  };

  const appClassName = isHdrEnabled ? "app hdr-on" : "app";

  return (
    <div className={appClassName}>
      <HdrControls
        isHdrSupported={isHdrSupported}
        isHdrEnabled={isHdrEnabled}
        onToggle={handleHdrToggle}
        isViewTransitionEnabled={isViewTransitionEnabled}
        onToggleViewTransition={handleViewTransitionToggle}
      />
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
          isTransitioningFromGrid={transitioningImageId === selectedImage.id}
        />
      )}
    </div>
  );
};
