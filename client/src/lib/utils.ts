import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiUrlDB = "https://sniplet-50029808958.catalystappsail.in";

export const handleLoginWithGoogle = () => {
  window.open(`${apiUrlDB}/api/auth/google`, "_self");
};

export const handleLoginWithGithub = () => {
  window.open(`${apiUrlDB}/api/auth/github`, "_self");
};
