"use client";

import Logger from "@/components/logger";
import { isCustomEvent } from "@/utils/isCustomEvent";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handleEvent = (e: Event): void => {
      if (isCustomEvent(e)) {
        const { detail } = e;
        const { value } = detail;
        setValue((lines) => value + "\n" + lines);
      }
    };
    // windowにdispatchされてくるカスタムイベントを受け取る
    window.addEventListener("sample-event", handleEvent);
    return () => {
      window.removeEventListener("sample-event", handleEvent);
    };
  }, []);

  function handleClick() {
    // 親のwindowにカスタムイベントをdispatchする
    window.parent.dispatchEvent(
      new CustomEvent("sample-event", {
        detail: { value: "message from inner" },
      })
    );
  }

  return (
    <div>
      <h1>inner page</h1>
      <button type="button" onClick={handleClick}>
        message
      </button>
      <Logger value={value} />
    </div>
  );
}
