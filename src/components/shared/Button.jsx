import { forwardRef } from "react";

const Button = forwardRef(({
  children,
  variant = "default",
  size = "md",
  color = "secondary",
  text,
  disabled = false,
  className = "",
  width = "full",
  ...props
}, ref) => {
  const baseStyles = "h-10 inline-flex items-center justify-center gap-2 font-medium cursor-pointer transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-default";

  const getVariantStyles = (variant, color, textColor) => {
    const defaultTextColor = textColor || (variant === "default" || variant === "error" ? "white" : color);
    const hoverTextColor = textColor || "white";

    const variants = {
      default: `bg-${color} text-${defaultTextColor} hover:enabled:bg-${color}/80 focus:ring-tertiary border border-transparent`,
      outline: `bg-transparent border border-${color} text-${defaultTextColor} hover:enabled:bg-${color} hover:enabled:text-${hoverTextColor}`,
      ghost: `bg-transparent border border-transparent text-${defaultTextColor} hover:enabled:bg-${color}/10`,
      text: `bg-transparent border-none text-${defaultTextColor} hover:enabled:text-${defaultTextColor}/80 p-0`,
      error: `bg-error text-${textColor || "white"} hover:enabled:bg-error/80 border border-transparent`
    };
    return variants[variant] || variants.default;
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-sm",
    md: "px-4 py-2 text-base rounded-sm",
    lg: "px-6 py-3 text-lg rounded-md"
  };

  const getWidthClass = (width) => {
    const widthClasses = {
      full: "w-full",
      fit: "w-fit",
      auto: "w-auto",
      max: "w-max",
      min: "w-min"
    };

    // Si es un número, agregar w- al principio
    if (/^\d+$/.test(width)) {
      return `w-${width}`;
    }

    return widthClasses[width] || "w-full";
  };

  const variantStyles = getVariantStyles(variant, color, text);
  const sizeStyles = sizes[size] || sizes.md;
  const widthClass = getWidthClass(width);

  const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${widthClass} ${className}`.trim();

  return (
    <button
      ref={ref}
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;