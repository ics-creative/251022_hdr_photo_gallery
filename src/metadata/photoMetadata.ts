/** 写真のEXIFメタデータを保持する構造体 */
export interface PhotoMetadata {
  /** F値 */
  aperture: number | null;
  /** 露光時間（秒） */
  shutterSpeed: number | null;
  /** ISO感度 */
  iso: number | null;
  /** 露出補正量 */
  exposureCompensation: number | null;
  /** メーカー名 */
  make: string | null;
  /** カメラモデル名 */
  model: string | null;
  /** レンズ名 */
  lens: string | null;
  /** 焦点距離（mm） */
  focalLength: number | null;
}
