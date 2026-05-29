import { ArrowLeft } from "lucide-react";
import { useSmartBack } from "../hooks/useSmartBack.js";

export default function PageBackButton({ fallback = "/", className = "", label = "Back" }) {
  const goBack = useSmartBack(fallback);

  return (
    <button
      type="button"
      onClick={goBack}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/25"
      }
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}
