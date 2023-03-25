"use client";

import Logger from "@/components/logger";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");

  // BroadcastChannelを使って、ページ内の全てのコンテキスト間でメッセージを受け取る
  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    const channel = new BroadcastChannel("channel");
    channel.onmessage = (e) => {
      const { data } = e;
      if (data.type === "update") {
        const { value } = data;
        setValue((lines) => value + "\n" + lines);
      }
    };
    channelRef.current = channel;
    return () => {
      channel.close();
    };
  }, []);

  function handleClick() {
    channelRef.current?.postMessage({
      type: "update",
      value: `child${window.name}: message with random value: ${Math.random()}`,
    });
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
