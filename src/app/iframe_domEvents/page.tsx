"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logger from "@/components/logger";
import Multipane from "@/components/multipane";
import { isCustomEvent } from "../../utils/isCustomEvent";

export default function Page() {
  const pathname = usePathname();
  const ref = useRef<HTMLIFrameElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    // windowにdispatchEventされてくるカスタムカスタムイベントを受け取る
    const onEvent = (e: Event) => {
      if (isCustomEvent(e)) {
        const { detail } = e;
        const { value } = detail;
        setValue((lines) => value + "\n" + lines);
      }
    };
    window.addEventListener("sample-event", onEvent);
    return () => {
      window.removeEventListener("sample-event", onEvent);
    };
  }, []);
  function handleClick() {
    // 子ページのwindowにカスタムイベントをdispatchしてメッセージを送る
    ref.current?.contentWindow?.dispatchEvent(
      new CustomEvent("sample-event", {
        detail: { value: "message from parent" },
      })
    );
  }
  return (
    <div>
      <h1>iframe + DOM Events(sameorigin only)</h1>
      <p>just work(tm)</p>
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
