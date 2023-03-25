"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Multipane from "@/components/multipane";

export default function Page() {
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(0);
  const ref1 = useRef<HTMLIFrameElement>(null);
  const ref2 = useRef<HTMLIFrameElement>(null);
  const ref3 = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 子フレームのreadyを待つ
    const onMessage = (e: MessageEvent) => {
      const { data } = e;
      if (data.type === "ready") {
        setLoaded((loaded) => {
          const id = +data.from;
          return loaded | (1 << (id - 1));
        });
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    if (loaded === 0b111) {
      const channel12 = new MessageChannel();
      const channel23 = new MessageChannel();
      const channel31 = new MessageChannel();
      ref1.current?.contentWindow?.postMessage({ type: "port" }, "*", [
        channel12.port1,
        channel31.port2,
      ]);
      ref2.current?.contentWindow?.postMessage({ type: "port" }, "*", [
        channel12.port2,
        channel23.port1,
      ]);
      ref3.current?.contentWindow?.postMessage({ type: "port" }, "*", [
        channel23.port2,
        channel31.port1,
      ]);
    }
  }, [loaded]);
  return (
    <div>
      <h1>iframe + Channel Messaging API (+ window.postMessage)</h1>
      <p>
        個別の通信路を開くChannel Messaging
        APIは、複数用意することで容易にプライバシーを守りながら複数コンテキスト間の通信を実装できる。
      </p>
      <Multipane>
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
        <iframe
          name="3"
          src={`${pathname}/inner`}
          style={{ border: "1px solid" }}
          ref={ref3}
          height="360px"
        />
      </Multipane>
    </div>
  );
}
