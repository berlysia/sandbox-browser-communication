"use client";

import Logger from "@/components/logger";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  const port1Ref = useRef<MessagePort | null>(null);
  const port2Ref = useRef<MessagePort | null>(null);

  useEffect(() => {
    // 親ページに準備完了を通知する
    window.parent.postMessage({ type: "ready", from: window.name }, "*");

    // 親ページからMessagePortを受け取る
    const onMessage = (e: MessageEvent) => {
      const { data } = e;
      if (data.type === "port") {
        const [port1, port2] = e.ports;
        port1Ref.current = port1;
        port2Ref.current = port2;

        port1.onmessage = port2.onmessage = (e: MessageEvent) => {
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

  function handle1Click() {
    port1Ref.current?.postMessage({
      type: "update",
      value: `child${window.name}: message with random value: ${Math.random()}`,
    });
  }
  function handle2Click() {
    port2Ref.current?.postMessage({
      type: "update",
      value: `child${window.name}: message with random value: ${Math.random()}`,
    });
  }

  return (
    <div>
      <h1>inner page</h1>
      <button type="button" onClick={handle1Click}>
        message1
      </button>
      <button type="button" onClick={handle2Click}>
        message2
      </button>
      <Logger value={value} />
    </div>
  );
}
