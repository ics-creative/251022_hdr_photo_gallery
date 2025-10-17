import { flushSync } from "react-dom";

declare global {
  interface Document {
    startViewTransition: (callback: () => void) => ViewTransition;
  }
}

class InstantViewTransition implements ViewTransition {
  finished = Promise.resolve();
  ready = Promise.resolve();
  updateCallbackDone = Promise.resolve();
  types = new Set<string>();
  skipTransition(): void {}
}

/** 画像表示用のビュー遷移名 */
export const DETAIL_VIEWER_TRANSITION_NAME = "viewer-image";

const isSafariBrowser = () => {
  const ua = navigator.userAgent;

  const isSafari =
    ua.includes("Safari") &&
    !ua.includes("Chrome") &&
    !ua.includes("Chromium") &&
    !ua.includes("CriOS") &&
    !ua.includes("FxiOS") &&
    !ua.includes("Edg") &&
    !ua.includes("OPR");

  return isSafari;
};

export let enabledViewTransition = !isSafariBrowser();

export const setEnabledViewTransition = (enabled: boolean) => {
  enabledViewTransition = enabled;
};

/** View Transition API 経由で状態更新を包む */
export const startViewTransition = (callback: () => void) => {
  if (enabledViewTransition === false) {
    flushSync(callback);
    return new InstantViewTransition();
  }

  return document.startViewTransition(() => {
    flushSync(callback);
  });
};

/** 指定方向に合わせてビュー遷移を実行し、方向フラグを更新する */
export const startDetailImageTransition = (direction: "prev" | "next", callback: () => void) => {
  document.documentElement.dataset.direction = direction;
  const transition = startViewTransition(callback);
  void (async () => {
    try {
      await transition.finished;
    } finally {
      delete document.documentElement.dataset.direction;
    }
  })();
  return transition;
};
