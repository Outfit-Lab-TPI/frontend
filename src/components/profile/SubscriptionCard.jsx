import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ChevronRight } from "lucide-react";

function SubscriptionCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/suscripcion")}
      className="w-full bg-gray/10 flex items-center justify-between rounded-sm p-6 shadow-xl cursor-pointer hover:bg-gray/20 transition-colors"
    >
      <div className="flex items-center gap-2 text-white">
        <CreditCard />
        <span className="text-lg font-medium">Mis subscripciones</span>
      </div>
      <ChevronRight />
    </div>
  );
}

export default SubscriptionCard;
