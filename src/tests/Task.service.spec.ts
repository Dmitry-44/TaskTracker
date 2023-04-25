import PiniaInterfaceAdapter from "@/adapters/piniaInterfaceAdapter"
import PiniaTaskAdapter from "@/adapters/piniaTaskAdapter"
import PiniaUserAdapter from "@/adapters/piniaUserAdapter"
import TaskRepo from "@/api/task"
import type { Task } from "@/entities/task"
import type { User } from "@/entities/user"
import TaskService from "@/services/task"
import {describe, expect, it, jest } from '@jest/globals';


jest.mock('@/api/task', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('@/adapters/piniaInterfaceAdapter', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('@/adapters/piniaTaskAdapter', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('@/adapters/piniaUserAdapter', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('@/plugins/io', () => ({
	__esModule: true,
	default: jest.fn(),
}));
  
//user id = 399
//selected_group = 43
const userMock: User = {"selected_group":43,"groups": [], "rights":{"mh_video":2,"mh_seo_module":2,"mh_all_posts":2,"qiwi":0,"mh_post_up":2,"gpt":0,"mh_polls":2,"mh_tasktracker":2,"mh_post_publish":2,"mh_smi_dashbord":2,"mh_authors":2,"mh_categories":2,"mh_footnotes":2,"mh_posts_department":2,"push_sites":2,"push_sender":2,"users":0,"ic_report":2,"ic_report_post":2,"ic_report_comments":2,"metrika_front_api":2,"yandex_new_top":2,"dashboard_balance":2,"presscard":2,"planmanager":2,"norms":2,"heroofday":2,"reports":2,"experts":2,"org_struct":0,"all_experts":2,"sound_decoder":2,"gantt_calendar":0,"social_posting":2,"feeds":2,"daily_duty":2,"daily_duty_curator":2,"title_watcher":2,"map_api":2,"kpi":2,"mh_photobank":2,"mh_photobank_trash":2,"mtm":0,"mh_photobank_front":2,"mh_banners":2,"mh_quizes":2,"tt_task_accept":2},"id":399,"fio":"Сакович Дмитрий Васильевич"}

const taskService = new TaskService(
		new TaskRepo(),
        new PiniaTaskAdapter(),
        new PiniaInterfaceAdapter(),
        new PiniaUserAdapter()
)

describe ('can change task title ?', () => {

	it('задача создана пользователем и имеет статус < 3 - можно менять тайтл', () => {
		const taskMock: Task = {
			id: 233,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			status: 2,
			created_by: 399
		}
		let canChangeTaskTitle = taskService.canChangeTaskTitle(taskMock, userMock)
		expect(canChangeTaskTitle).toBe(true)
	})

	it('задача создана другим пользователем - нельзя менять тайтл', () => {
		const taskMock: Task = {
			id: 233,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			status: 2,
			created_by: 111
		}
		let canChangeTaskTitle = taskService.canChangeTaskTitle(taskMock, userMock)
		expect(canChangeTaskTitle).toBe(false)
	})
	it('задача имеет статус 3(завершена) - нельзя менять тайтл', () => {
		const taskMock: Task = {
			id: 399,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			status: 3,
			created_by: 111
		}
		let canChangeTaskTitle = taskService.canChangeTaskTitle(taskMock, userMock)
		expect(canChangeTaskTitle).toBe(false)
	})
})

describe ('can change task division ?', () => {
	it('Задача в режиме создания (id<0) - можно менять task division', () => {
		const taskMock: Task = {
			id: -1,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		let canChangeTaskDivision = taskService.canChangeTaskDivision(taskMock, userMock)
		expect(canChangeTaskDivision).toBe(true)
	})

	it('Задача в режиме создания (id=0) - можно менять task division', () => {
		const taskMock: Task = {
			id: 0,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		let canChangeTaskDivision = taskService.canChangeTaskDivision(taskMock, userMock)
		expect(canChangeTaskDivision).toBe(true)
	})

	it('Задача уже создана и имеет id - нельзя менять task division', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		let canChangeTaskDivision = taskService.canChangeTaskDivision(taskMock, userMock)
		expect(canChangeTaskDivision).toBe(false)
	})
})

describe ('can change task priority ?', () => {
	it('Задача в режиме создания (id<0) - можно менять task priority', () => {
		const taskMock: Task = {
			id: -1,
			priority: 1,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		const canChangeTaskPriority = taskService.canChangeTaskPriority(taskMock, userMock)
		expect(canChangeTaskPriority).toBe(true)
	})
	it('Задача в режиме создания (id=0) - можно менять task priority', () => {
		const taskMock: Task = {
			id: 0,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		const canChangeTaskPriority = taskService.canChangeTaskPriority(taskMock, userMock)
		expect(canChangeTaskPriority).toBe(true)
	})
	it('Задача уже создана нами и имеет id - можно менять task priority', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			created_by: 399
		}
		const canChangeTaskPriority = taskService.canChangeTaskPriority(taskMock, userMock)
		expect(canChangeTaskPriority).toBe(true)
	})
	it('Задача имеет статус 3(завершена) - нельзя менять task priority', () => {
		const taskMock: Task = {
			id: 22,
			status: 3,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		const canChangeTaskPriority = taskService.canChangeTaskPriority(taskMock, userMock)
		expect(canChangeTaskPriority).toBe(false)
	})
	it('Задача создана другим пользователем - нельзя менять task priority', () => {
		const taskMock: Task = {
			id: 22,
			status: 3,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			created_by: -1,
		}
		const canChangeTaskPriority = taskService.canChangeTaskPriority(taskMock, userMock)
		expect(canChangeTaskPriority).toBe(false)
	})
})

describe ('can take task ?', () => {
	it('Задача в режиме создания (id<0) - нельзя взять задачу', () => {
		const taskMock: Task = {
			id: -1,
			priority: 1,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(false)
	})
	it('Задача в режиме создания (id=0) - нельзя взять задачу', () => {
		const taskMock: Task = {
			id: 0,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(false)
	})
	it('последний евент имеет статус > 1', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			event_entities: [
				{
					id: 22,
					created: 22222,
					modified: 22223,
					status: 2,
					selected_users: [],
					selected_divisions: [],
					result: {}
				}
			],
			created_by: 22
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(false)
	})
	it('последний евент задачи не имеет полей selected_users и selected_divisions', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			event_entities: [
				{
					id: 22,
					created: 22222,
					modified: 22223,
					status: 1,
					result: {}
				}
			],
			created_by: 22
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(true)
	})
	it('последний евент задачи имеет поле selected_users с id нашего user', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			event_entities: [
				{
					id: 22,
					created: 22222,
					modified: 22223,
					status: 1,
					selected_users: [100, 399, 250],
					result: {}
				}
			],
			created_by: 22
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(true)
	})
	it('последний евент задачи имеет поле selected_users без id нашего юзера', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			event_entities: [
				{
					id: 22,
					created: 22222,
					modified: 22223,
					status: 1,
					selected_users: [100, 400, 250],
					selected_divisions: [],
					result: {}
				}
			],
			created_by: 22
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(false)
	})
	it('последний евент задачи имеет поле selected_divisions с id нашего user', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			event_entities: [
				{
					id: 22,
					created: 22222,
					modified: 22223,
					status: 1,
					selected_divisions: [22,43,50],
					result: {}
				}
			],
			created_by: 22
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(true)
	})
	it('последний евент задачи имеет поле selected_divisions без id нашего юзера', () => {
		const taskMock: Task = {
			id: 22,
			title: 'Тестовая таска',
			text: 'Текст задачи',
			pipe_data: {},
			event_entities: [
				{
					id: 22,
					created: 22222,
					modified: 22223,
					status: 1,
					selected_divisions: [22, 50],
					result: {}
				}
			],
			created_by: 22
		}
		const canTakeTask = taskService.canTakeTask(taskMock, userMock)
		expect(canTakeTask).toBe(false)
	})
})