import { Link } from "react-router-dom";
import { User } from "lucide-react";
import NotificationDropdown from '../NotificationDropdown'
import Button from "../shared/Button";

function Header() {
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
        to="/home"
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
        <Link to="/marcas">
          <Button size="sm" className="bg-transparent border-white/40">
            Ver marcas
          </Button>
        </Link>

        <NotificationDropdown />

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
      </div>
    </header>
  );
}

export default Header;
