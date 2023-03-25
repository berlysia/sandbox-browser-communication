"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Multipane from "@/components/multipane";
import Logger from "@/components/logger";

export default function Page() {
  const pathname = usePathname();
  const [value, setValue] = useState("");
  const ref1 = useRef<HTMLIFrameElement>(null);
  const ref2 = useRef<HTMLIFrameElement>(null);

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
      value: `parent: message with random value: ${Math.random()}`,
    });
  }

  return (
    <div>
      <h1>BroadcastChannel</h1>
      <p>
        個別の通信路を開くChannel Messaging
        APIは、複数用意することで容易にプライバシーを守りながら複数コンテキスト間の通信を実装できる。
      </p>
      <button type="button" onClick={handleClick}>
        message
      </button>
      <Multipane>
        <Logger value={value} />
        <iframe
          name="1"
          src={`${pathname}/inner`}
          style={{ border: "1px solid" }}
          ref={ref1}
          height="360px"
        />
        <iframe
          name="2"
          src={`${pathname}/inner`}
          style={{ border: "1px solid" }}
          ref={ref2}
          height="360px"
        />
      </Multipane>
    </div>
  );
}
