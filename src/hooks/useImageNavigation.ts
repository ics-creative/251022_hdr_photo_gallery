import { flushSync } from "react-dom";
import { useRef, useState } from "react";
import type { ImageInfo } from "../images/imageList";
import { startDetailImageTransition, startViewTransition } from "../animations/viewTransitions";

interface UseImageNavigationProps {
  images: ImageInfo[];
}

interface UseImageNavigationReturn {
  selectedImage: ImageInfo | null;
  selectedImageIndex: number;
  isNavigating: boolean;
  transitioningImageId: string | null;
  scrollPositionRef: React.RefObject<number>;
  handleImageClick: (image: ImageInfo, index: number) => Promise<void>;
  handleCloseViewer: () => Promise<void>;
  handleNavigate: (direction: "prev" | "next") => Promise<void>;
}

/** 画像ナビゲーション状態とハンドラーを管理するカスタムフック */
export const useImageNavigation = ({
  images,
}: UseImageNavigationProps): UseImageNavigationReturn => {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [transitioningImageId, setTransitioningImageId] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);

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

    // レンダリング後に、スクロール位置を調整するためマジックナンバーで指定
    setTimeout(() => {
      window.scrollTo({ top: previousScrollPosition });
    }, 33);

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

    const newImage = images[newIndex];

    // view-transition-nameを設定してからView Transitionを開始
    flushSync(() => {
      setIsNavigating(true);
      setTransitioningImageId(newImage.id);
    });

    // DOMの更新を確実に反映させるため、ダブルRAFで次のフレームまで待つ
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });

    const transition = startDetailImageTransition(direction, () => {
      setSelectedImageIndex(newIndex);
      setSelectedImage(newImage);
    });

    try {
      await transition.finished;
    } catch {
      // no-op
    } finally {
      flushSync(() => {
        setIsNavigating(false);
        setTransitioningImageId(null);
      });
    }
  };

  return {
    selectedImage,
    selectedImageIndex,
    isNavigating,
    transitioningImageId,
    scrollPositionRef,
    handleImageClick,
    handleCloseViewer,
    handleNavigate,
  };
};
