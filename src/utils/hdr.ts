/** HDR検出用のメディアクエリ */
export const HDR_MEDIA_QUERIES: readonly string[] = ["(dynamic-range: high)"];

/** HDR対応ディスプレイかどうかを判定 */
export const isHdrCapable = (): boolean => matchMedia(HDR_MEDIA_QUERIES.at(0)!).matches;
