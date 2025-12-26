import { STORAGE_KEYS } from "../../utils/constants";
import type { User } from "../../utils/types/common.types";

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const setUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const setRememberMe = (remember: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(remember));
};

export const getRememberMe = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === "true";
};

export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};
