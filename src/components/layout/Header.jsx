import { Link } from "react-router-dom";
import { User } from "lucide-react";
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
              {/* ADMIN → notificaciones */}
              {user.role === "ADMIN" && <NotificationDropdown />}
          
              {/* ADMIN y USER → Ver marcas */}
              {(user.role === "ADMIN" || user.role === "USER") && (
                <Link to="/marcas">
                  <Button size="sm" className="bg-transparent border-white/40">
                    Ver marcas
                  </Button>
                </Link>
              )}
        
              {/* Todos los roles → Perfil */}
              <Link to="/perfil">
                <div
                  className="size-10 rounded-full 
                    bg-(--secondary) 
                    flex items-center justify-center 
                    cursor-pointer 
                    transition-colors duration-300 
                    hover:bg-(--primary)"
                >
                  <User size={20} color="var(--white)" />
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
