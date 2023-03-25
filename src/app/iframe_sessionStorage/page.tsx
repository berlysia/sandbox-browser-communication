"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logger from "@/components/logger";
import Multipane from "@/components/multipane";

export default function Page() {
  const pathname = usePathname();
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(sessionStorage.getItem("message") ?? "(empty)");
  }, []);

  useEffect(() => {
    // sessionStorageの値の変化を監視する
    const onStorage = (e: StorageEvent) => {
      if (e.key === "message") {
        setValue((lines) => e.newValue + "\n" + lines);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("storage-mimic", onStorage as (e: Event) => void);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "storage-mimic",
        onStorage as (e: Event) => void
      );
    };
  }, []);
  function handle1Click() {
    // sessionStorageに書き込む
    const oldValue = sessionStorage.getItem("message");
    const newValue = "message from parent";
    sessionStorage.setItem("message", newValue);
    if (newValue !== oldValue) {
      window.dispatchEvent(
        new StorageEvent("storage-mimic", {
          key: "message",
          newValue,
          oldValue,
        })
      );
    }
  }
  return (
    <div>
      <h1>iframe + sessionStorage</h1>
      <p>
        sessionStorageを使うと同じセッション内で文字列ベースのKVSが共有できる。別タブを開くと共有されないがリロードでは維持される。
        <br />
        iframeやwindow.openした相手が遷移した先でも同じ値を読めて、かつ変化を検知できる道具として有用。postMessageと違っていろいろと取り廻す必要もない。
      </p>
      <p>
        いっぽうでプライバシーは同一オリジン内では皆無で、文字列ベースなのでJSONを使うときはJSON.stringify/parseを使う必要がある。バイナリデータを扱うときはBase64を使ったりする。
      </p>
      <p>
        localStorageを使うと能動的に削除されるまで共有できるようになるが、セッションごとに独立する性質は失われるので用途が変わってくる。
      </p>
      <button type="button" onClick={handle1Click}>
        message1
      </button>
      <a href={pathname} target="_blank" rel="noopener noreferrer">
        open in new tab
      </a>
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
