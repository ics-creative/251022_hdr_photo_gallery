import { useEffect, useState } from "react";
import { HDR_MEDIA_QUERIES, isHdrCapable } from "../utils/hdr";

/** HDRサポート状態を管理するカスタムフック */
export const useHdrSupport = () => {
  const [isHdrSupported, setIsHdrSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const updateHdrSupport = () => {
      setIsHdrSupported(isHdrCapable());
    };

    updateHdrSupport();

    const mediaQueries = HDR_MEDIA_QUERIES.map((query) => window.matchMedia(query));
    mediaQueries.forEach((query) => query.addEventListener("change", updateHdrSupport));
    return () => {
      mediaQueries.forEach((query) => query.removeEventListener("change", updateHdrSupport));
    };
  }, []);

  return isHdrSupported;
};
