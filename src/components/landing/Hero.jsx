import CallToAction from "../ui/CallToAction";

export default function HeroSection() {
  return (
    <section>
      <div className="grid grid-cols-12 gap-4 lg:gap-2 items-center p-5 md:px-10">
        <div className="col-span-12 md:col-span-7 max-w-[600px] mx-auto">
          <h1 className="!text-4xl md:!text-5xl text-center md:text-left sm:mx-5 lg:mx-0 leading-tight">
            Transforma tu catálogo en un
            <span className="text-[var(--tertiary)] font-semibold">
              {" "}
              probador virtual 2D interactivo{" "}
            </span>
            para tus clientes
          </h1>
          <div className="m-4 hidden md:block lg:mx-0">
            <CallToAction align="left" text="Descubrir el probador virtual" />
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="overflow-hidden shadow-xxl rounded-lg max-w-[330px] xl:max-w-[380px] h-[420px] md:h-[530px] mx-auto">
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
      <div className="m-4 w-full mx-auto md:hidden">
        <CallToAction text="Descubrir el probador virtual" />
      </div>
    </section>
  );
}
