"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-4 rounded-full border border-zinc-300 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
    >
      Drukuj / zapisz PDF
    </button>
  );
}
