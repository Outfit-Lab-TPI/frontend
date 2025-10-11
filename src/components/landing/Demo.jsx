import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

function Model({ url, ...props }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} {...props} />;
}

export default function DemoSection() {
  return (
    <section className="mx-auto my-20 rounded-lg shadow-lg">
      <div className="flex flex-col px-8 md:px-20 lg:flex-row items-center gap-10 mx-auto">
        <div className="lg:w-1/2 leading-loose text-[var(--gray)]">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--white)] text-left mb-8">
            Cómo tus prendas cobran vida en el probador virtual
          </h2>

          <p className="text-lg mb-6">
            Outfit Lab convierte tus prendas en modelos digitales de forma
            automática y precisa, listos para integrarse a tu tienda online.
          </p>

          <ul className="space-y-6 text-lg">
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 flex items-center justify-center font-bold text-[var(--white)]">
                1
              </span>
              <span>
                Tomá fotos de cada prenda —frente, espalda y costado— y subilas
                en la plataforma.
              </span>
            </li>

            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 flex items-center justify-center font-bold text-[var(--white)]">
                2
              </span>
              <span>
                Nuestro sistema genera una representación digital en 2D lista
                para el probador virtual.
              </span>
            </li>

            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 flex items-center justify-center font-bold text-[var(--white)]">
                3
              </span>
              <div className="flex flex-col">
                <span>
                  Los modelos se agregan al catálogo interactivo para que los
                  clientes puedan seleccionar las prendas sobre un avatar y
                  crear su outfit ideal antes de comprar.
                </span>
              </div>
            </li>
          </ul>
        </div>
        {/* // usando react-three-fiber para mostrar un modelo 3D */}
        {/* <div className="lg:w-1/2 h-[400px] mx-auto max-w-[400px] md:h-[500px] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#926490]/30 to-[#e3c18a]/10 rounded-full blur-3xl" />

          <div className="relative z-10 w-full h-full">
            <Canvas camera={{ position: [0, -0.3, 4] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Environment preset="city" />
              <OrbitControls
                enableZoom={true}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
              />
              <Model
                url="/avatars/trippo-german.glb"
                scale={[3.5, 3.5, 3.5]}
                position={[0, -0.3, 0]}
                rotation={[0, -Math.PI / 2, 0]}
              />
            </Canvas>
          </div>
        </div> */}
        {/* usando una imagen muestra de fashn.ai */}
        <img
          src="./demo.jpg"
          alt="Demostración del probador virtual"
          className="lg:w-1/2 mx-auto h-auto rounded-lg shadow-md"
        />
      </div>
    </section>
  );
}
