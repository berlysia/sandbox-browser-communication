"use client";

import Logger from "@/components/logger";
import { useEffect, useRef, useState } from "react";

export default function Page() {
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

  function handleClick() {
    // sessionStorageに書き込む
    const oldValue = sessionStorage.getItem("message");
    const newValue = "message from inner" + window.name;
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
      <h1>inner page</h1>
      <button type="button" onClick={handleClick}>
        message
      </button>
      <button type="button" onClick={() => location.reload()}>
        reload
      </button>
      <Logger value={value} />
    </div>
  );
}
