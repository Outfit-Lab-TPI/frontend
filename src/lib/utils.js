import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function handleBack(navigate, url) {
  if (url) {
    navigate(url);
    return;
  }

  if (window.history.length > 1) {
    navigate(-1);
    return;
  }

  navigate("/perfil");
}
