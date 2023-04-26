import { isSuccessApiResponse, type ApiResponse } from '@/api';
import { emptyUser, type Division } from '@/entities/user';
import type { IUserRepo, User, Person } from "@/entities/user";
import router from '@/router';
import { envConfig } from '@/plugins/envConfig';
import type { NavigationGuardNext } from 'vue-router';
import { services } from "@/main";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import type { ICommonStore, IUserStore } from '@/adapters';


export default class UserService {

	userRepo;
	userStore;
	commonStore;

	constructor(userRepo: IUserRepo, userStore: IUserStore, commonStore: ICommonStore) {
		this.userRepo = userRepo;
		this.userStore = userStore;
		this.commonStore = commonStore;
	}

	async checkAuth(): Promise<boolean> {
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

	async logout(): Promise<boolean> {
		return this.userRepo
			.Logout()
			.then(()=>true)
	}

	async getAllUsers(): Promise<ApiResponse<User>> {
		return this.userRepo
			.GetUsersList()
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					this.userStore.setUsers(respdata.result as Person[])
					return true
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err));
	}

	async getDivisions(): Promise<boolean> {
		return this.userRepo
			.GetDivisions()
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					this.userStore.setDivisions(respdata.result as Division[])
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err))
	}

	async getPersonsByDivision(divisionId: Division['id']): Promise<boolean> {
		return this.userRepo
			.GetPersonsByDivision(divisionId)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					this.userStore.setPersons(divisionId, respdata.result);
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err))
	}

	initAuthMiddleware() {
		const COOKIE_LIFETIME = 24 * 60 * 60 * 1000; //ms
		router.beforeEach((to, from, next) => {
			this.commonStore.showGlobalLoader()
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
				this.commonStore.hideGlobalLoader()
				next();
			}
		});
	}

	chechRights(
		userStore: IUserStore,
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
		this.commonStore.hideGlobalLoader()
		return access ? next() : next({ path: "401" });
	}
}