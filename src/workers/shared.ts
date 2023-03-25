export default function createWorker() {
  const worker = new SharedWorker(new URL("./sharedImpl.ts", import.meta.url));
  return worker;
}
