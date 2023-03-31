import { defineStore } from "pinia";
import { axiosClient } from "@/plugins/axios";
import { envConfig } from "@/plugins/envConfig";
import type { User } from "@/types/user";

interface State {
  is_auth: boolean;
  user: User | null;
  globalLoader: boolean;
}

export const useUserStore = defineStore({
  id: "user",
  state: (): State => ({
    user: null,
    is_auth: false,
    globalLoader: true,
  }),
  getters: {
    getRights: (state) => state?.user?.rights || {},
    getUser: (state) => state.user,
    getLoader: (state) => state.globalLoader,
  },
  actions: {
    setUser(payload: User|null){
      this.user=payload
    },
    setIsAuth(payload: boolean){
      this.is_auth=payload
    },
    showLoader() {
      this.globalLoader = true;
    },
    hideLoader() {
      setTimeout(() => (this.globalLoader = false), 100);
    },
    logout(): Promise<boolean> {
      return axiosClient
        .get(`${envConfig.AUTH_URL}/auth/logout`)
        .then(() => true);
    },
    checkAuth(): Promise<boolean> {
      return axiosClient
        .get(`${envConfig.AUTH_URL}/auth/checkLogin`)
        .then((resp) => {
          this.is_auth = true;
          this.user = resp.data.auth;
          return true;
        })
        .catch(() => {
          this.is_auth = true;
          this.user = null;
          return false;
        });
    },
  },
});
