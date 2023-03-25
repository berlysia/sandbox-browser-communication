"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logger from "@/components/logger";
import Multipane from "@/components/multipane";

export default function Page() {
  const pathname = usePathname();
  const ref = useRef<HTMLIFrameElement>(null);
  const portRef = useRef<MessagePort | null>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    // 子ページがpostMessageで送ってくるMessagePortを受け取る
    const onMessage = (e: MessageEvent) => {
      const { data } = e;
      if (data.type === "port") {
        const port = e.ports[0];
        // MessagePortを使って子ページにメッセージを送る
        setValue((lines) => "system: port received\n" + lines);
        port.postMessage({ type: "update", value: "Hello World from parent" });

        portRef.current = port;

        port.onmessage = (e: MessageEvent) => {
          const { data } = e;
          if (data.type === "update") {
            const { value } = data;
            setValue((lines) => value + "\n" + lines);
          }
        };
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);
  function handleClick() {
    // MessagePortを使って子ページにメッセージを送る
    portRef.current?.postMessage({
      type: "update",
      value: "message from parent",
    });
  }
  return (
    <div>
      <h1>iframe + Channel Messaging API (+ window.postMessage)</h1>
      <p>
        window.postMessageを使い続けるのと比較して、他のウインドウに伝わらない独立した通信路になるのが利点。targetOriginの検証も最初だけでよい。
      </p>
      <button type="button" onClick={handleClick}>
        message
      </button>
      <Multipane>
        <Logger value={value} />
        <iframe
          src={`${pathname}/inner`}
          style={{ border: "1px solid" }}
          ref={ref}
          height="400px"
          width="400px"
        />
      </Multipane>
    </div>
  );
}
