/** ギャラリーで扱う画像情報 */
export interface ImageInfo {
  /** ファイル名 */
  filename: string;
  /** 参照パス */
  path: string;
  /** サムネイル参照パス */
  thumbnailPath: string;
  /** 一意なID */
  id: string;
  /** 画面表示用の説明 */
  description: string;
}

const imageEntries = Object.keys(
  import.meta.glob("/public/avif/*", {
    eager: true,
    import: "default",
  }),
);

const toFilename = (fullPath: string): string => {
  const segments = fullPath.split("/");
  const name = segments[segments.length - 1];
  if (!name) {
    throw new Error();
  }
  return name;
};

const imageFiles = imageEntries
  .map(toFilename)
  .filter((filename) => !filename.startsWith("."))
  .sort((a, b) => a.localeCompare(b, "en"));

/** ギャラリー表示用の画像一覧を取得する */
export const getImageList = (): ImageInfo[] => {
  return imageFiles.map((filename, index) => ({
    filename,
    path: `/avif/${filename}`,
    thumbnailPath: `/thumbs/${filename}`,
    id: `image-${index + 1}`,
    description: `Photo ${index + 1}`,
  }));
};
