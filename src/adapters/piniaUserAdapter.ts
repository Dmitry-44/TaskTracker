import { useUserStore } from '@/stores/user';
import type { User } from "@/types/user";
import type { IUserStore } from './types';



export default class PiniaUserAdapter implements IUserStore{

	userStore; 

	constructor(){
		this.userStore = useUserStore();
	}
	getUser(){
		return this.userStore.getUser;
	}
	setIsAuth(payload: boolean): void{
		return this.userStore.setIsAuth(payload);
	}
    setUser(payload: User | null): void {
        return this.userStore.setUser(payload);
    }
}