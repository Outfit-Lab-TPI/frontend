import React, { useState, useRef } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import { useNotifications } from "../hooks/admin/useNotifications";
import { ArrowUpRight } from "lucide-react";
const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const { notifications, approveBrand } = useNotifications();
  const [localNotifications, setLocalNotifications] = useState([]);
  const dropdownRef = useRef(null);

  React.useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApprove = async (codigoMarca) => {
    await approveBrand(codigoMarca);
    setLocalNotifications((prev) =>
      prev.filter((n) => n.brand.codigoMarca !== codigoMarca)
    );
  };

  return (
    <div className="" ref={dropdownRef}>
      <button
        className="relative text-gray-700 hover:text-gray-900 focus:outline-none "
        onClick={() => setOpen(!open)}
      >
        <FiBell size={26} className="text-white hover:cursor-pointer"/>
        {localNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {localNotifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-90 bg-[#1C161F] rounded-xl shadow-lg z-50 overflow-hidden p-2">
          {localNotifications.length === 0 ? (
            <div className="p-4 text-white text-center">No hay notificaciones</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {localNotifications.map((n) => (
                <div
                  key={n.brand.codigoMarca}
                  className="flex items-center justify-between p-3 hover:bg-[#16111A] transition-colors duration-200 border-[#E3C18A] hover:rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={n.brand.logoUrl}
                      alt={n.brand.nombre}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
                    />
                    <div>
                      <div className="font-medium text-white">{n.brand.nombre}</div>
                      <div className="text-sm text-gray-500">
                        {n.brand.urlSite ? (
                          <a
                            href={n.brand.urlSite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E3C18A] flex items-center transition-transform duration-200 ease-in-out hover:translate-x-2"
                          >
                            Sitio web
                            <ArrowUpRight size={16} className="ml-1" />
                          </a>
                        ) : (
                          "Sitio no registrado"
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(n.brand.codigoMarca)}
                    className="text-green-500 hover:text-green-700 hover:cursor-pointer"
                  >
                    <FiCheck
                      size={20}
                      className="transition-transform duration-200 ease-in-out hover:-translate-x-1"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
