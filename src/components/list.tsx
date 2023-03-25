import Link from "next/link";

export default function List() {
  return (
    <details>
      <summary>links...</summary>
      <ul>
        <li>
          1:1 communication
          <ul>
            <li>
              <Link href="/iframe_domEvents">
                parent-iframe with DOM Events(sameorigin only, event only)
              </Link>
            </li>
            <li>
              <Link href="/iframe_messagePort">
                parent-iframe with Channel Messaging API + window.postMessage
              </Link>
            </li>
          </ul>
        </li>
        <li>
          broadcast communication
          <ul>
            <li>
              <Link href="/iframe_postMessage">
                parent-iframe with window.postMessage(event only)
              </Link>
            </li>
            <li>
              <Link href="/broadcastchannel">
                BroadcastChannel(sameorigin only, event only)
              </Link>
            </li>
          </ul>
        </li>
        <li>
          n:n communication
          <ul>
            <li>
              <Link href="/iframe_messagePort_multi">
                iframe-iframe with Channel Messaging API + window.postMessage
                (event only)
              </Link>
            </li>
          </ul>
        </li>
        <li>
          shared context communication
          <ul>
            <li>
              <Link href="/iframe_sessionStorage">
                iframe + sessionStorage(sameorigin only)
              </Link>
            </li>
            <li>iframe + localStorage(sameorigin only) (see sessionStorage)</li>
            <li>
              <Link href="/sharedWorker">SharedWorker(sameorigin only)</Link>
            </li>
            <li>ServiceWorker(sameorigin only) (see SharedWorker)</li>
          </ul>
        </li>
      </ul>
    </details>
  );
}
