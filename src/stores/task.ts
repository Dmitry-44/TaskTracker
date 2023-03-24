import  TaskRepo  from '@/api/task';
import { defineStore } from "pinia";
import type { Task } from "@/types/task";


interface TaskOption {
	id: number;
	value: string;
	color: string;
}
interface EventStatusOption {
	id: number;
	value: string;
	color: string;
}
interface State {
	tasks: Task[];
	singleTask: Task | null;
	priorityOptions: TaskOption[];
	statusOptions: TaskOption[];
	eventStatusOptions: EventStatusOption[];
	activeTask: Task;
}


export const useTaskStore = defineStore({
	id: "task",
	state: (): State => ({
		priorityOptions: [
			{ id: 1, value: "Молния", color: "#E6A23C" },
			{ id: 2, value: "Срочная", color: "#F56C6C" },
			{ id: 3, value: "Базовая", color: "#409EFF" },
			{ id: 4, value: "Низкая", color: "#909399" },
		],
		statusOptions: [
			{ id: 1, value: "Создана", color: "#f06a6a" },
			{ id: 2, value: "Обработана", color: "#4ecbc4" },
			{ id: 3, value: "В работе", color: "#f8df72" },
			{ id: 4, value: "Закончена", color: "#909399" },
		],
		eventStatusOptions: [
			{ id: 1, value: "Создана", color: "" },
			{ id: 2, value: "В работе", color: "#f8df72" },
			{ id: 3, value: "Готово", color: "#67C23A" },
		],
		activeTask: Object.assign({}, TaskRepo.emptyTask),
		tasks: [],
		singleTask: null,
	}),
	getters: {
		getList: (state): Task[] => state.tasks,
		getSingleTask: (state) => state.singleTask,
		getPriorityOptions: (state): TaskOption[] => state.priorityOptions,
		getStatusOptions: (state): TaskOption[] => state.statusOptions,
		getActiveTask: (state) => state.activeTask,
		getEventStatusOptions: (state): EventStatusOption[] =>state.eventStatusOptions,
	},
	actions: {
		setActiveTask(payload: Task): void {
			this.activeTask = payload;
		},
		setTasksList(payload: Task[]): void {
			this.tasks = payload;
		},
		setSingleTask(payload: Task | null): void {
			this.singleTask = payload;
		},
	},
});