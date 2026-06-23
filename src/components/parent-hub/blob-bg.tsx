export function BlobBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--mec-blue)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-25"
        style={{ background: "var(--mec-yellow)" }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full blur-3xl opacity-15"
        style={{ background: "var(--mec-blue)" }}
      />
    </div>
  );
}
