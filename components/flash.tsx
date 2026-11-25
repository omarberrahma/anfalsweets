export function Flash({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  const isError = Boolean(error);
  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${
        isError
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
      role="status"
    >
      <i className={`fa-solid ${isError ? "fa-circle-exclamation" : "fa-circle-check"} mt-0.5`} />
      <span>{error ?? ok}</span>
    </div>
  );
}
