import { useState } from "react";
import { User, ChevronDown, Check } from "lucide-react";
import { useAuth } from "../hooks/auth/useAuth";

function AvatarDropdown({
  avatarType,
  onAvatarTypeChange,
  disabled = false
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const userHasPhoto = Boolean(user?.userImg);

  const avatarOptions = [
    { value: 'man', label: 'Hombre' },
    { value: 'woman', label: 'Mujer' },
    { value: 'custom', label: 'Mi foto', disabled: !userHasPhoto }
  ];

  const selectedOption = avatarOptions.find(option => option.value === avatarType);

  const toggleExpanded = () => {
    if (!disabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleOptionSelect = (value) => {
    const option = avatarOptions.find(opt => opt.value === value);
    if (!option?.disabled) {
      onAvatarTypeChange(value);
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      {/* Botón del dropdown */}
      <button
        onClick={toggleExpanded}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors border ${
          disabled
            ? 'bg-gray/5 text-gray/50 border-gray/10 cursor-not-allowed'
            : 'bg-gray/10 text-gray hover:text-white border-gray/20 hover:border-gray/40'
        }`}
      >
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">
          {selectedOption?.label}
          {avatarType === 'custom' && !userHasPhoto && ' (sin foto)'}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-black border border-gray/20 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="space-y-1">
              {avatarOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  disabled={option.disabled}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                    avatarType === option.value
                      ? 'bg-primary/20 text-white border border-primary/30'
                      : option.disabled
                      ? 'text-gray/50 cursor-not-allowed'
                      : 'text-gray hover:text-white hover:bg-gray/10'
                  }`}
                >
                  <span className="text-sm font-medium flex-1">
                    {option.label}
                    {option.disabled && ' (sin foto)'}
                  </span>
                  {avatarType === option.value && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </button>
              ))}
            </div>

            {!userHasPhoto && (
                <p className="text-xs text-gray px-3">
                  Sube una foto en tu perfil para usarla
                </p>
            )}
          </div>
        </div>
      )}

      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}

export default AvatarDropdown;