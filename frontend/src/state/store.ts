import { create } from "zustand";

interface AuthStore {
  userInfo: UserInfo | null;
  setCredentials: (userInfo: UserInfo) => void;
  logout: () => void;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
}

export const useAuthStore = create<AuthStore>((set) => {
  const storedUserInfo = localStorage.getItem("userInfo");

  return {
    userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
    setCredentials: (userInfo) => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime.toString());

      set({ userInfo });
    },
    logout: () => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");

      set({ userInfo: null });
    },
  };
});
