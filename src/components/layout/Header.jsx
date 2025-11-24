import { Link } from "react-router-dom";
import { User, BarChart3, Store, Shirt, Layers  } from "lucide-react";
import NotificationDropdown from '../NotificationDropdown'
import Button from "../shared/Button";

import { useAuth } from './../../hooks/auth/useAuth'

function Header() {

  const { user } = useAuth()
  let destino = "/";

  if(user){
    switch (user.role) {
      case "ADMIN":
        destino = "/dashboard";
        break;
      case "BRAND":
        destino = "/brand-home";
        break;
      case "USER":
        destino = "/home";
        break;
      default:
        destino = "/home";
    }
  }

  return (
    <header
      className="header bg-[#0a050e]/90 backdrop-blur-md border-b border-[#926490]/20"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        height: "60px",
      }}
    >
      
      <Link
        to={destino}
        style={{
          textDecoration: "none",
          height: "fit-content",
          alignItems: "center",
          display: "flex",
        }}
      >
        <img
          src="/isologo.svg"
          alt="Outfit-Lab-logo"
          style={{ height: "40px" }}
        />
      </Link>

      <div className="flex items-center gap-4">

        {/* si NO hay user, no muestro nada */}
        {
          user && (
            <>
              {
                user.role === "ADMIN" && <NotificationDropdown />
              }

               {
                  (user.role === "BRAND") && ( 
                  <>

                    <Link to="/brand-home">
                      <Button
                        size="sm"
                        className="bg-transparent border border-white/40 text-white hover:bg-white/10 flex items-center gap-2"
                      >
                        <Shirt className="w-4 h-4" />
                        <span className="hidden sm:inline">Catálogo</span>
                      </Button>
                    </Link>

                    <Link to="/reportes">
                      <Button
                        size="sm"
                        className="bg-transparent border border-white/40 text-white hover:bg-white/10 flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Reportes</span>
                      </Button>
                    </Link>
                       
                  </>
                  )
                }

                {
                  (user.role === "USER") && (
                    <>

                      <Link to="/home">
                          <Button
                            size="sm"
                            className="bg-transparent border border-white/40 text-white hover:bg-white/10 flex items-center gap-2"
                          >
                            <Layers   className="w-4 h-4" />
                            <span className="hidden sm:inline">Probador</span>
                          </Button>
                      </Link>

                      <Link to="/marcas">
                        <Button
                          size="sm"
                          className="bg-transparent border border-white/40 text-white hover:bg-white/10 flex items-center gap-2"
                        >
                          <Store className="w-4 h-4" />
                          <span className="hidden sm:inline">Ver marcas</span>
                        </Button>
                      </Link>
                    </>
                  )
                }
        
            

              <Link to="/perfil" className="flex flex-columns gap-4 items-center justify-center transition">
                  <p className="transition-all duration-300 hover:text-yellow-400 hover:translate-x-1 inline-block">{user.name}</p>
                  <div
                    className="size-10 rounded-full 
                               bg-(--secondary) 
                               flex items-center justify-center 
                               cursor-pointer 
                               transition-colors duration-300 
                               hover:bg-(--primary)
                               overflow-hidden"
                  >
                    {user.userImg ? (
                      <img
                        src={user.userImg}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} color="var(--white)" />
                    )}
                  </div>
              </Link>
            </>
          )
        }

      </div>
    </header>
  );
}

export default Header;
