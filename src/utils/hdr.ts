/** HDR検出用のメディアクエリ */
export const HDR_MEDIA_QUERIES: readonly string[] = ["(dynamic-range: high)"];

/** HDR対応ディスプレイかどうかを判定 */
export const isHDRCapable = (): boolean => {
  const isHDR = screen.colorDepth >= 30 && window.matchMedia("(dynamic-range: high)").matches;
  return isHDR;
};
