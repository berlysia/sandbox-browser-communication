"use client";

import Logger from "@/components/logger";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  const portRef = useRef<MessagePort | null>(null);

  useEffect(() => {
    // ChannelMessagingAPIでMessagePortを取得し、親ページに渡す
    const channel = new MessageChannel();
    window.parent.postMessage({ type: "port" }, "*", [channel.port2]);
    setValue("system: sent port to parent");

    // sendMessageからMessagePortにアクセスできるようにportをrefで保持する
    portRef.current = channel.port1;

    // MessagePortを使って親ページからのメッセージを受け取る
    channel.port1.onmessage = (e) => {
      const { data } = e;
      if (data.type === "update") {
        const { value } = data;
        setValue((lines) => value + "\n" + lines);
      }
    };
  }, []);

  function handleClick() {
    // MessagePortを使って親ページにメッセージを送信する
    portRef.current?.postMessage({
      type: "update",
      value: "message from inner",
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
