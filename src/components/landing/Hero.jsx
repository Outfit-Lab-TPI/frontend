export default function HeroSection() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-2 items-center px-1 md:px-10">
      <div className="col-span-12 md:col-span-7 max-w-[600px] mx-auto">
        <h1 className="!text-4xl md:!text-5xl text-center sm:mx-5 lg:mx-0">
          Transforma tu catálogo en una
          <span className="text-[var(--tertiary)]">
            {" "}
            experiencia 3D premium{" "}
          </span>
          para tus clientes
        </h1>
      </div>
      <div className="col-span-12 md:col-span-5">
        <div className="overflow-hidden shadow-xxl rounded-lg max-w-[330px] xl:max-w-[380px] h-[420px] md:h-[530px]">
          <video
            className="w-full object-center rounded-lg"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="./hero-video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
