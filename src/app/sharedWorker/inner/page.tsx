"use client";

import Logger from "@/components/logger";
import createWorker from "@/workers/shared";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  const workerRef = useRef<SharedWorker>();

  useEffect(() => {
    // SharedWorkerを作成する
    const worker = createWorker();
    workerRef.current = worker;

    // SharedWorkerからのメッセージを受け取る
    const onMessage = (e: MessageEvent) => {
      const { data } = e;
      if (data.type === "message") {
        const { value } = data;
        setValue((lines) => value + "\n" + lines);
      }
    };
    worker.port.addEventListener("message", onMessage);
    worker.port.start();
    return () => {
      worker?.port.removeEventListener("message", onMessage);
    };
  }, []);
  function handleClick() {
    // SharedWorkerにメッセージを送る
    workerRef.current?.port.postMessage({
      type: "message",
      value: "message from child" + window.name,
    });
  }
  function handleBroadcast() {
    // SharedWorkerにメッセージを送る
    workerRef.current?.port.postMessage({
      type: "broadcast",
      value: "message from child" + window.name,
    });
  }

  return (
    <div>
      <h1>inner page</h1>
      <button type="button" onClick={handleClick}>
        message
      </button>
      <button type="button" onClick={handleBroadcast}>
        broadcast
      </button>
      <button type="button" onClick={() => location.reload()}>
        reload
      </button>
      <Logger value={value} />
    </div>
  );
}
