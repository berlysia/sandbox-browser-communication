"use client";

import Logger from "@/components/logger";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");

  useEffect(() => {
    // 親ページからのpostMessageを受け取る
    const onMessage = (e: MessageEvent) => {
      const { data } = e;
      if (e.origin !== location.origin) return;
      if (data.type === "update") {
        const { value } = data;
        setValue((lines) => value + "\n" + lines);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  function handleClick() {
    // postMessageで親ページにメッセージを送る
    window.parent.postMessage(
      { type: "update", value: "message from inner" },
      location.origin
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
