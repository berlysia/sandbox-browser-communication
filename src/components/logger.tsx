export default function Logger({ value }: { value: string }) {
  return (
    <div>
      <textarea
        value={value}
        readOnly
        style={{ width: "100%", height: "360px" }}
      ></textarea>
    </div>
  );
}
