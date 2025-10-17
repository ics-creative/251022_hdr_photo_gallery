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

const avifImages = import.meta.glob<string>("../assets/avif/*.avif", {
  eager: true,
  import: "default",
});

const thumbImages = import.meta.glob<string>("../assets/thumbs/*.avif", {
  eager: true,
  import: "default",
});

const toFilename = (fullPath: string): string => {
  const segments = fullPath.split("/");
  const name = segments[segments.length - 1];
  if (!name) {
    throw new Error();
  }
  return name;
};

const imageEntries = Object.entries(avifImages)
  .map(([path, url]) => ({
    filename: toFilename(path),
    path: url,
  }))
  .filter((item) => !item.filename.startsWith("."))
  .sort((a, b) => a.filename.localeCompare(b.filename, "en"));

/** ギャラリー表示用の画像一覧を取得する */
export const getImageList = (): ImageInfo[] => {
  return imageEntries.map((item, index) => {
    const thumbKey = Object.keys(thumbImages).find((key) => key.endsWith(`/${item.filename}`));
    const thumbnailPath = thumbKey ? thumbImages[thumbKey] : item.path;

    return {
      filename: item.filename,
      path: item.path,
      thumbnailPath,
      id: `image-${index + 1}`,
      description: `Photo ${index + 1}`,
    };
  });
};
