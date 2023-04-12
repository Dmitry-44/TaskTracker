import { useUserStore } from '@/stores/user';
import type { Division, User, Person } from "@/types/user";
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
	setUsers(payload: Person[]): void {
		return this.userStore.setUsers(payload);
	}
	setDivisions(payload: Division[]): void {
		return this.userStore.setDivisions(payload);
	}
	setPersons(divisionId: Division['id'], payload: Person[]): void {
		this.userStore.setPersons(payload);
		this.userStore.setDivisionData(divisionId, payload)
	}
	getDivisionList(): Division[] {
		return this.userStore.getDivisions
	}
}