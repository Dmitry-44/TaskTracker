export interface Event {
	id: UniqueId;
	task_id?: UniqueId;
	operation_id?: UniqueId;
	created: DateTimeStamp;
	modified: DateTimeStamp;
	finished?: DateTimeStamp;
	u_id?: UniqueId;
	user_name?: string;
	status: EventStatus;
	selected_users?: UniqueId[];
	selected_divisions?: UniqueId[];
	result: Record<string, unknown>;
	params?: Record<string, unknown>;
}

export enum EventStatus {
	CREATED = 1,
	IN_PROGRESS = 2,
	COMPLETED = 3,
}

export const eventStatusOptions: Readonly<Record<string, any>[]> = [
	{ id: EventStatus.CREATED, value: "Создана", color: "" },
	{ id: EventStatus.IN_PROGRESS, value: "В работе", color: "#f8df72" },
	{ id: EventStatus.COMPLETED, value: "Готово", color: "#67C23A" },
]