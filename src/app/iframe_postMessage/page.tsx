"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logger from "@/components/logger";
import Multipane from "@/components/multipane";

export default function Page() {
  const pathname = usePathname();
  const ref1 = useRef<HTMLIFrameElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    // 子ページからのpostMessageを受け取る
    const onMessage = (e: MessageEvent) => {
      const { data } = e;
      if (e.origin !== location.origin) return;
      if (data.type === "update") {
        const { value } = data;
        setValue((lines) => value + "\n" + lines);
        // e.source.postMessage({ type: "update", value: "これでも応答できる" }, e.origin);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);
  function handle1Click() {
    // 子ページにpostMessageでメッセージを送る
    ref1.current?.contentWindow?.postMessage(
      {
        type: "update",
        value: "message from parent",
      },
      location.origin
    );
  }
  return (
    <div>
      <h1>iframe + window.postMessage</h1>
      <button type="button" onClick={handle1Click}>
        message1
      </button>
      <Multipane>
        <Logger value={value} />
        <iframe
          src={`${pathname}/inner`}
          style={{ border: "1px solid" }}
          height="360px"
          ref={ref1}
        />
      </Multipane>
    </div>
  );
}
