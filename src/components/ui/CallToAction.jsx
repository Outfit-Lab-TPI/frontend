export default function CallToAction({
  url = "/login",
  align = "center",
  text = "Visitar probador virtual",
}) {
  return (
    <div className={`text-${align}`}>
      <a
        href={url}
        className="relative inline-block font-semibold px-6 py-3 rounded-full hover:!text-[var(--primary)] overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 group"
      >
        <span className="absolute inset-0 bg-[var(--secondary)] group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>

        <span className="absolute inset-0 bg-[var(--tertiary)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>

        <span className="relative z-10">{text}</span>
      </a>
    </div>
  );
}
