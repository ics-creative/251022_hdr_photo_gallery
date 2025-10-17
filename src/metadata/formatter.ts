import type { PhotoMetadata } from "./photoMetadata";

/** 数値を小数点付きの文字列へ整形する */
const formatDecimal = (value: number | null) => {
  if (value == null || !Number.isFinite(value) || value === 0) return "";
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
};

/** F値を表示用の文字列に変換する */
const formatAperture = (value: number | null) => {
  const formatted = formatDecimal(value);
  return formatted ? `F${formatted}` : "";
};

/** 焦点距離を表示用の文字列に変換する */
const formatFocalLength = (value: number | null) => {
  const formatted = formatDecimal(value);
  return formatted ? `${formatted}mm` : "";
};

/** ISO感度を表示用の文字列に変換する */
const formatISO = (value: number | null) => {
  if (value == null || !Number.isFinite(value) || value <= 0) return "";
  return `ISO${Math.round(value)}`;
};

/** シャッタースピードを表示用の文字列に変換する */
const formatShutterSpeed = (seconds: number | null) => {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "";
  if (seconds >= 1) {
    const precision = Number.isInteger(seconds) ? 0 : 1;
    return `${seconds.toFixed(precision)}sec`;
  }

  const reciprocal = 1 / seconds;
  const rounded = Math.round(reciprocal);
  if (Math.abs(reciprocal - rounded) < 1e-3) {
    return `1/${rounded}sec`;
  }

  const denominator = Math.round(reciprocal);
  if (denominator === 0) return "";
  return `1/${denominator}sec`;
};

/** メーカーとモデル名を結合してカメラ名を生成する */
const joinCamera = (make: string | null, model: string | null) => {
  return [make, model].filter((part): part is string => Boolean(part && part.trim())).join(" ");
};

/** 写真メタデータを表示用の要約文字列に整形する */
export const formatPhotoMetadata = (metadata: PhotoMetadata | null): string => {
  if (!metadata) return "";

  const segments = [
    joinCamera(metadata.make, metadata.model),
    metadata.lens ?? "",
    formatFocalLength(metadata.focalLength),
    formatShutterSpeed(metadata.shutterSpeed),
    formatAperture(metadata.aperture),
    formatISO(metadata.iso),
  ].filter((segment) => segment !== "");

  return segments.join(", ");
};
