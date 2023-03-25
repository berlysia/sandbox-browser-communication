export {};

const worker = self as unknown as Worker;

const set = new Set<MessagePort>();

worker.addEventListener("connect", ((connectEvent: MessageEvent) => {
  const port = connectEvent.ports[0];

  port.postMessage({ type: "message", value: "connected" });
  port.addEventListener("message", (event) => {
    if (event.data.type === "broadcast") {
      for (const x of set) {
        x.postMessage({ type: "message", value: event.data.value });
      }
    }
    if (event.data.type === "message") {
      port.postMessage({ type: "message", value: event.data.value });
    }
  });

  port.addEventListener("close", () => {
    set.delete(port);
  });

  set.add(port);
  port.start();
}) as (e: Event) => void);
