import { useUserStore } from '@/stores/user';
import type { Division, User, UserSimple } from "@/types/user";
import type { IUserStore } from './types';



export default class PiniaUserAdapter implements IUserStore{

	userStore; 

	constructor(){
		this.userStore = useUserStore();
	}
	getUserIsAuth(){
		return this.userStore.getIsAuth;
	}
	getRights(){
		return this.userStore.getRights;
	}
	getUser(){
		return this.userStore.getUser;
	}
	setIsAuth(payload: boolean): void{
		return this.userStore.setIsAuth(payload);
	}
    setUser(payload: User): void {
        return this.userStore.setUser(payload);
    }
	setUsers(payload: UserSimple[]): void {
		return this.userStore.setUsers(payload);
	}
	setDivisions(payload: Division[]): void {
		return this.userStore.setDivisions(payload);
	}
}