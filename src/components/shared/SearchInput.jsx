import { X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}) {
  return (
    <div className="relative w-40 lg:w-48">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-md bg-gray/10 border border-gray/30 text-sm w-full text-white pr-8 focus:ring-2 focus:ring-primary"
      />

      {value?.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray hover:text-white transition"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
