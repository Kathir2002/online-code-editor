import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiUrlDB = "https://code-editor.cyclic.app";

export const handleLoginWithGoogle = () => {
  window.open(`${apiUrlDB}/api/auth/google`, "_self");
};
