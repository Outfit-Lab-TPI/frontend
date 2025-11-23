import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight } from "lucide-react";

function OutfitsCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/mis-combinaciones")}
      className="w-full bg-gray/10 flex items-center justify-between rounded-sm p-6 shadow-xl cursor-pointer hover:bg-gray/20 transition-colors"
    >
      <div className="flex items-center gap-2 text-white">
        <ShoppingBag />
        <span className="text-lg font-medium">Mis outfits</span>
      </div>
      <ChevronRight />
    </div>
  );
}

export default OutfitsCard;
