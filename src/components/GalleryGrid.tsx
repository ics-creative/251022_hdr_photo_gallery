import { DETAIL_VIEWER_TRANSITION_NAME } from "../animations/viewTransitions";
import { getImageList, type ImageInfo } from "../images/imageList";
import "./GalleryGrid.css";

interface GalleryGridProps {
  onImageClick: (image: ImageInfo, index: number) => void;
  activeTransitionImageId?: string | null;
}

const images = getImageList();

const layoutPattern = [
  { columnSpan: 2, rowSpan: 2 },
  { columnSpan: 1, rowSpan: 1 },
  { columnSpan: 1, rowSpan: 1 },
  { columnSpan: 1, rowSpan: 2 },
  { columnSpan: 1, rowSpan: 1 },
  { columnSpan: 2, rowSpan: 1 },
];

/** ギャラリー画像をグリッドで表示するコンポーネント */
export const GalleryGrid = ({ onImageClick, activeTransitionImageId }: GalleryGridProps) => {
  return (
    <main className="gallery-grid">
      <div className="gallery-header">
        <h1>HDR Gallery</h1>
      </div>
      <div className="grid-container">
        {images.map((image, index) => {
          const layout = layoutPattern[index % layoutPattern.length];
          return (
            <button
              key={image.id}
              className="grid-item"
              onClick={() => onImageClick(image, index)}
              style={{
                gridColumn: `span ${layout.columnSpan}`,
                gridRow: `span ${layout.rowSpan}`,
              }}
            >
              <img
                src={image.thumbnailPath}
                alt=""
                loading="lazy"
                style={
                  activeTransitionImageId === image.id
                    ? { viewTransitionName: DETAIL_VIEWER_TRANSITION_NAME }
                    : undefined
                }
              />
            </button>
          );
        })}
      </div>
    </main>
  );
};
