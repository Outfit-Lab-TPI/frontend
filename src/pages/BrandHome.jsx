import { useNavigate } from "react-router-dom";    
import Button from "../components/shared/Button.jsx";
import { Plus } from "lucide-react";

export default function BrandHome() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Bienvenido a la página de la marca</h1>
      <Button
      width="fit"
      onClick={() => { navigate(`/nueva-prenda`); }}>
        <Plus size={16} />
        Nueva prenda
      </Button>
    </div>
  )
}
