import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiUrlDB = "http://localhost:5000";

export const handleLoginWithGoogle = () => {
  window.open(`http://localhost:5000/api/auth/google`, "_self");
};
