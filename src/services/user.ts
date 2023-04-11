import { emptyUser, type Division } from './../types/user';
import type { IUserRepo, User, Person } from "@/types/user";
import router from '@/router';
import { envConfig } from '@/plugins/envConfig';
import type { NavigationGuardNext } from 'vue-router';
import { services } from "@/main";
import type PiniaUserAdapter from "@/adapters/piniaUserAdapter";
import type PiniaInterfaceAdapter from "@/adapters/piniaInterfaceAdapter";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import { errRequestHandler } from "@/plugins/errorResponser";


export default class UserService {

	userRepo;
	userStore;
	interfaceStore;

	constructor(userRepo: IUserRepo, userStore: PiniaUserAdapter, interfaceStore: PiniaInterfaceAdapter) {
		this.userRepo = userRepo;
		this.userStore = userStore;
		this.interfaceStore = interfaceStore;
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
				this.userStore.setUser(emptyUser)
				return false;
			});
	}

	logout(): Promise<boolean> {
		return this.userRepo
			.Logout()
			.then(()=>true)
	}

	getAllUsers(): Promise<ApiResponse<User>> {
		return this.userRepo
			.GetUsersList()
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					this.userStore.setUsers(respdata.result as Person[])
					return true
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	}

	getDivisions(): Promise<boolean> {
		return this.userRepo
			.GetDivisions()
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					this.userStore.setDivisions(respdata.result as Division[])
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err))
	}

	initAuthMiddleware() {
		const COOKIE_LIFETIME = 24 * 60 * 60 * 1000; //ms
		router.beforeEach((to, from, next) => {
			this.interfaceStore.showGlobalLoader()
			if (to.query["auth"]) {
				console.log("cookie exist");
				document.cookie = `connect.sid=${to.query["auth"]};path=/;expires=${new Date(Date.now() + COOKIE_LIFETIME).toUTCString()}`;
			}
			if (to.matched.some((record) => record.meta["requiresAuth"])) {
				if (this.userStore.getUserIsAuth()) {
					return this.chechRights(this.userStore, to.meta["rights"] as User['rights'], next);
				}
				return services.User.checkAuth().then(res => {
					if (res) {
						return this.chechRights(this.userStore, to.meta["rights"] as User['rights'], next);
					} else {
						window.location.href = `${envConfig.CLIENT_COOKIE}/auth_service?redirect=http://${location.host}${to.fullPath}`;
					}
				});
			} else {
				this.interfaceStore.hideGlobalLoader()
				next();
			}
		});
	}

	chechRights(
		userStore: PiniaUserAdapter,
		rightsObj: User['rights'],
		next: NavigationGuardNext
	) {
		const rights = userStore.getRights();
		let access = true;
		for (const prop in rightsObj) {
			if (!rights[prop] || rights[prop] < rightsObj[prop]) {
				access = false;
				break;
			}
		}
		this.interfaceStore.hideGlobalLoader()
		return access ? next() : next({ path: "401" });
	}
}