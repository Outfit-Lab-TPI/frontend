import { ArrowRight } from "lucide-react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';

function Model({ url, ...props }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} {...props} />;
}

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-0 max-[1000px]:pt-20"
    >
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #926490 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading text-[#fffcf5] leading-none tracking-tight">
                PROBÁ TU OUTFIT EN LÍNEA
              </h1>
              <p className="text-lg md:text-xl text-[#fffcf5]/80 leading-relaxed max-w-xl">
                Experimenta la moda del futuro con nuestro probador virtual de ropa en 3D. Visualiza cómo te queda
                cualquier prenda antes de comprar.
              </p>
            </div>

            <button
              className="button-index hover-pointer bg-[#926490] hover:bg-[#926490]/90 text-[#fffcf5] text-lg px-8 py-6 rounded-full inline-flex items-center group transition-all"
            >
              Visitar probador virtual
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            
          </div>

          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#926490]/30 to-[#e3c18a]/10 rounded-full blur-3xl" />

              <div className="relative z-20 h-150 w-100">
                <Canvas camera={{ position: [0, -4, 0] }}>
                  <Environment preset="city" />
                  <ambientLight intensity={0.5} />

                  <OrbitControls
                    minPolarAngle={Math.PI / 2}
                    maxPolarAngle={Math.PI / 2}
                    target={[0, 0, 0]}
                    enableZoom={true} 
                  />

                  <Model
                    url="/avatars/trippo-german.glb"
                    scale={[5, 5, 5]}
                    position={[0, 0, 0]}
                  />
                </Canvas>
              </div>

              <div className="absolute top-1/4 -left-4 w-24 h-24 border border-[#926490]/30 rounded-full" />
              <div className="absolute bottom-1/4 -right-4 w-32 h-32 border border-[#e3c18a]/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#926490] rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#926490] rounded-full" />
        </div>
      </div>
    </section>
  );
}
