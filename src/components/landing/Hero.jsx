import CallToAction from "../ui/CallToAction";

export default function HeroSection() {
  return (
    <section id="inicio">
      <div className="grid grid-cols-12 gap-4 lg:gap-2 items-center p-5 md:px-10">
        <div className="col-span-12 md:col-span-7 max-w-[600px] mx-auto">
          <h1 className="!text-4xl md:!text-5xl text-center md:text-left max-w-[480px] sm:mx-5 lg:mx-0 leading-tight">
            Probá la{" "}
            <span className="text-[var(--tertiary)] font-semibold">moda</span>{" "}
            virtual
          </h1>
          <em className="text-[var(--white)] max-w-[480px] sm:mx-5 lg:mx-0 hidden md:block mt-4 text-lg text-left mt-[-5px] mb-5">
            Permití a tus clientes probarse tus prendas en segundos.
          </em>
          <div className="m-4 hidden md:block lg:mx-0">
            <CallToAction align="left" text="Descubrir más" />
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="overflow-hidden shadow-xxl rounded-lg max-w-[325px] xl:max-w-[360px] h-[420px] md:h-[510px] mx-auto">
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
      <em className="md:hidden block text-center text-[var(--white)] text-lg mb-10 px-5 max-w-[350px] mx-auto">
        Permití a tus clientes probarse tus prendas en segundos.
      </em>
      <div className="m-4 w-full mx-auto md:hidden">
        <CallToAction text="Descubrir más" />
      </div>
    </section>
  );
}
