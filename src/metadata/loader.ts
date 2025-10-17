import ExifReader from "exifreader";
import type { PhotoMetadata } from "./photoMetadata";

/** 画像パスごとのメタデータ読み込み結果をキャッシュするマップ */
const metadataCache = new Map<string, Promise<PhotoMetadata | null>>();

/** 分数表現のタグかどうかを判定する */
const isRationalObject = (value: unknown): value is { numerator: number; denominator: number } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "numerator" in value &&
    "denominator" in value &&
    typeof (value as { numerator: unknown }).numerator === "number" &&
    typeof (value as { denominator: unknown }).denominator === "number"
  );
};

/** EXIFタグから数値を抽出する */
const extractNumeric = (value: unknown): number | null => {
  if (value == null) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (Array.isArray(value)) {
    if (value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number") {
      const denominator = value[1];
      if (denominator !== 0) {
        return value[0] / denominator;
      }
      return null;
    }

    for (const item of value) {
      const numeric = extractNumeric(item as unknown);
      if (numeric !== null) {
        return numeric;
      }
    }
    return null;
  }

  if (isRationalObject(value)) {
    if (value.denominator === 0) {
      return null;
    }
    return value.numerator / value.denominator;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

/** EXIFタグから文字列を抽出する */
const extractString = (value: unknown): string | null => {
  if (value == null) return null;

  if (typeof value === "string") return value;

  if (typeof value === "number") return Number.isFinite(value) ? value.toString() : null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const stringValue = extractString(item as unknown);
      if (stringValue) {
        return stringValue;
      }
    }
    return null;
  }

  return null;
};

/** 読み取ったEXIFタグ群から必要なメタデータを整形する */
const parseMetadata = (tags: ExifReader.Tags): PhotoMetadata => {
  const readNumeric = (...keys: string[]) => {
    for (const key of keys) {
      const numeric = extractNumeric(tags[key]?.value);
      if (numeric != null) return numeric;
    }
    return null;
  };

  const readString = (...keys: string[]) => {
    for (const key of keys) {
      const stringValue = extractString(tags[key]?.value);
      if (stringValue) return stringValue;
    }
    return null;
  };

  const aperture =
    readNumeric("FNumber") ??
    ((): number | null => {
      const apex = readNumeric("ApertureValue");
      return apex != null ? Math.pow(2, apex / 2) : null;
    })();

  const shutterSpeed =
    readNumeric("ExposureTime") ??
    ((): number | null => {
      const apex = readNumeric("ShutterSpeedValue");
      return apex != null ? Math.pow(2, -apex) : null;
    })();

  return {
    aperture,
    shutterSpeed,
    iso: readNumeric("ISO", "ISOSpeedRatings"),
    exposureCompensation: readNumeric("ExposureCompensation"),
    make: readString("Make"),
    model: readString("Model", "CameraModelName"),
    lens: readString("LensModel", "Lens"),
    focalLength: readNumeric("FocalLength"),
  };
};

/** 指定パスの画像からEXIFメタデータを読み取る */
const fetchMetadata = async (imagePath: string): Promise<PhotoMetadata | null> => {
  try {
    const response = await fetch(imagePath, { cache: "force-cache" });
    if (!response.ok) {
      return null;
    }

    const buffer = await response.arrayBuffer();
    const tags = ExifReader.load(buffer);

    return parseMetadata(tags);
  } catch {
    return null;
  }
};

/** 画像メタデータをキャッシュ付きで取得する */
export const loadPhotoMetadata = (imagePath: string): Promise<PhotoMetadata | null> => {
  if (!metadataCache.has(imagePath)) {
    metadataCache.set(imagePath, fetchMetadata(imagePath));
  }
  return metadataCache.get(imagePath)!;
};
