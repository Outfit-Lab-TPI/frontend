import { Link } from "react-router-dom";
import { User, Wifi } from "lucide-react";

function Header() {
  return (
    <header
      className="flex justify-between items-center 
         m-6 md:m-12 lg:mx-20"
    >
      <Link to="/home" className="flex items-center">
        <img src="/isologo.svg" alt="Outfit Lab Logo" className="h-10" />
      </Link>

      <div className="flex items-center gap-3">
        <Link to="/test-connection">
          <div
            className="w-10 h-10 rounded-full 
              bg-blue-500 
              flex items-center justify-center 
              cursor-pointer 
              transition-colors duration-300 
              hover:bg-blue-600"
          >
            <Wifi size={20} color="white" />
          </div>
        </Link>

        <Link to="/profile">
          <div
            className="w-10 h-10 rounded-full 
              bg-[var(--secondary)] 
              flex items-center justify-center 
              cursor-pointer 
              transition-colors duration-300 
              hover:bg-[var(--primary)]"
          >
            <User size={20} color="var(--white)" />
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
