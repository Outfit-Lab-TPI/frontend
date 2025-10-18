import { Instagram } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="mt-16 p-8 bg-[#0a050e]/90 text-center text-sm text-[#fffcf5]/40 space-y-4  border-t border-[#926490]/20">
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 max-w-[1500px] mx-auto">
        <p>
          © 2025 Outfit Lab | Probador Virtual. Todos los derechos reservados.
        </p>
        <a
          href="https://www.instagram.com/outfit__lab__/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#fffcf5] hover:text-[#e3c18a] cursor-pointer"
        >
          <Instagram className="size-6" /> Instagram
        </a>
      </div>
    </footer>
  );
}
