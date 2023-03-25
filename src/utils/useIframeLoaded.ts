import { useEffect, useRef } from "react";

export default function useIframeLoad(
  callback: () => void,
  deps: unknown[] = []
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (iframe) {
      const handleLoad = () => {
        callback();
      };

      if (
        iframe.contentWindow &&
        iframe.contentDocument?.readyState === "complete"
      ) {
        // iframeがすでにロード完了している場合、コールバックを直ちに呼び出します。
        handleLoad();
      } else {
        // iframeがまだロード完了していない場合、'load'イベントをリスニングします。
        iframe.addEventListener("load", handleLoad);

        // クリーンアップ関数でイベントリスナーを解除します。
        return () => {
          iframe.removeEventListener("load", handleLoad);
        };
      }
    }
  }, [...deps]);

  return iframeRef;
}
