import PiniaInterfaceAdapter from "@/adapters/piniaInterfaceAdapter"
import PiniaTaskAdapter from "@/adapters/piniaTaskAdapter"
import PiniaUserAdapter from "@/adapters/piniaUserAdapter"
import TaskRepo from "@/api/task"
import type { Task } from "@/entities/task"
import type { User } from "@/entities/user"
import TaskService from "@/services/task"



const taskMock: Task = {
	id: 233,
	title: 'Тестовая таска',
	text: 'Текст задачи',
	pipe_data: {}
}

const userMock: User = {"selected_group":43,"rights":{"mh_video":2,"mh_seo_module":2,"mh_all_posts":2,"qiwi":0,"mh_post_up":2,"gpt":0,"mh_polls":2,"mh_tasktracker":2,"mh_post_publish":2,"mh_smi_dashbord":2,"mh_authors":2,"mh_categories":2,"mh_footnotes":2,"mh_posts_department":2,"push_sites":2,"push_sender":2,"users":0,"ic_report":2,"ic_report_post":2,"ic_report_comments":2,"metrika_front_api":2,"yandex_new_top":2,"dashboard_balance":2,"presscard":2,"planmanager":2,"norms":2,"heroofday":2,"reports":2,"experts":2,"org_struct":0,"all_experts":2,"sound_decoder":2,"gantt_calendar":0,"social_posting":2,"feeds":2,"daily_duty":2,"daily_duty_curator":2,"title_watcher":2,"map_api":2,"kpi":2,"mh_photobank":2,"mh_photobank_trash":2,"mtm":0,"mh_photobank_front":2,"mh_banners":2,"mh_quizes":2,"tt_task_accept":2},"id":399,"fio":"Сакович Дмитрий Васильевич"}

const taskService = new TaskService(
		new TaskRepo(),
        new PiniaTaskAdapter(),
        new PiniaInterfaceAdapter(),
        new PiniaUserAdapter()
)

describe('Task Service tests', () => {


	it('can', () => {
		let canChangeTaskTitle = taskService.canChangeTaskTitle(taskMock, userMock)
		expect(canChangeTaskTitle).toBe(false)
	})
})