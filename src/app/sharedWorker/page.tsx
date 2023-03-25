"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logger from "@/components/logger";
import Multipane from "@/components/multipane";
import createWorker from "@/workers/shared";

export default function Page() {
  const pathname = usePathname();
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
      value: "message from parent",
    });
  }
  function handleBroadcast() {
    // SharedWorkerにメッセージを送る
    workerRef.current?.port.postMessage({
      type: "broadcast",
      value: "message from parent",
    });
  }
  return (
    <div>
      <h1>SharedWorker</h1>
      <p>
        SharedWorkerを使うと、同じドメインのすべてのページから呼び出せるワーカーが作れる。独立したひとつのスレッドがあると思えばわかりやすい。
      </p>
      <p>
        SharedWorkerへの参照がなくなるとGCされてしまうので値の保持は他の方法が必要だが、複数ウィンドウ間で共有したい「処理」があるときにはうれしい。
      </p>
      <p>
        中心となるブラウジングコンテキストがなくても動作するので、うっかりタブを閉じてしまっても全部閉じない限り問題ない。
      </p>
      <p>
        ServiceWorkerも同じようなことができるポテンシャルがあるが、ブラウジングコンテキストがひとつもなくても動作することを期待したいときに使うのがよい。
      </p>
      <button type="button" onClick={handleClick}>
        message
      </button>
      <button type="button" onClick={handleBroadcast}>
        broadcast
      </button>
      <Multipane>
        <Logger value={value} />
        <iframe
          name="1"
          src={`${pathname}/inner`}
          style={{ border: "1px solid" }}
          height="360px"
        />
        <iframe
          name="2"
          src={`${pathname}/inner`}
          style={{ border: "1px solid" }}
          height="360px"
        />
      </Multipane>
    </div>
  );
}
