"use client";
import List from "@/components/list";
import { useEffect, useState } from "react";

export function Header() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(window.parent === window);
  }, []);
  return (
    <header style={{ display: visible ? "initial" : "none" }}>
      <List />
    </header>
  );
}
