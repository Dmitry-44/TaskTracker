
import { useUserStore } from "@/stores/user";
import type { IUserRepo, User } from "@/types/user";
import router from '@/router';
import { envConfig } from '@/plugins/envConfig';
import type { NavigationGuardNext } from 'vue-router';
import { services } from "@/main";
import type PiniaUserAdapter from "@/adapters/piniaUserAdapter";


export default class UserService {

	userRepo;
	userStore;

	constructor(userRepo: IUserRepo, userStore: PiniaUserAdapter) {
		this.userRepo = userRepo;
		this.userStore = userStore
	}

	checkAuth(): Promise<boolean> {
		return this.userRepo
			.CheckLogin()
			.then(resp => {
				this.userStore.setIsAuth(true)
				this.userStore.setUser(resp.auth)
				return true;
			})
			.catch(() => {
				this.userStore.setIsAuth(false)
				this.userStore.setUser(null)
				return false;
			});
	}

	initMiddleware() {
		router.beforeEach((to, from, next) => {
			console.log('beforeEach+_____')
			const userStore = useUserStore();
			userStore.showLoader();
			if (to.query["auth"]) {
			  console.log("cookie exist");
			  document.cookie = `connect.sid=${
				to.query["auth"]
			  };path=/;expires=${new Date(Date.now() + 86400000).toUTCString()}`;
			}
			if (to.matched.some((record) => record.meta["requiresAuth"])) {
			  if (userStore.is_auth) {
				return chechRights(userStore, to.meta["rights"] as rightsObj, next);
			  }
			  return services.User.checkAuth().then(res => {
				if (res) {
				  return chechRights(userStore, to.meta["rights"] as rightsObj, next);
				} else {
				  window.location.href = `${envConfig.CLIENT_COOKIE}/auth_service?redirect=http://${location.host}${to.fullPath}`;
				}
			  });
			} else {
			  userStore.hideLoader();
			  next();
			}
		  });
		
		function chechRights(
			userStore: any,
			rightsObj: rightsObj,
			next: NavigationGuardNext
		) {
			const rights = userStore.getRights;
			let access = true;
			for (const prop in rightsObj) {
				if (!rights[prop] || rights[prop] < rightsObj[prop]) {
					access = false;
					break;
				}
			}
			userStore.hideLoader();
			return access ? next() : next({ path: "401" });
		}
	}
}

interface rightsObj {
	[key: string]: any;
  }
