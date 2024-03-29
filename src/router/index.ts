import {
	createRouter,
	createWebHistory,
} from "vue-router";

console.log('INIT ROUTER')

const routes = [
	{
		path: "/",
		name: "Главная",
		component: () => import("@/views/DefaultLayout.vue"),
		meta: { requiresAuth: true, rights: { mh_photobank_front: 2 } },
		children: [
			{
				path: "/",
				name: "Задачи",
				component: () => import("@/views/Kanban/Index.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/my",
				name: "Мои задачи",
				component: () => import("@/views/Kanban/My.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/archive",
				name: "Завершенные",
				component: () => import("@/views/Kanban/Archive.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/operations",
				name: "Операции",
				component: () => import("@/views/Operations/Index.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/operations/:id",
				name: "Операция",
				component: () => import("@/views/Operations/Edit.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/operations/create",
				name: "Создание операции",
				component: () => import("@/views/Operations/Create.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/pipes",
				name: "Пайплайны",
				component: () => import("@/views/Pipes/Index.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/pipes/:id",
				name: "Пайплайн",
				component: () => import("@/views/Pipes/Edit.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/pipes/create",
				name: "Создание пайплайна",
				component: () => import("@/views/Pipes/Create.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
			{
				path: "/tasks/:id",
				name: "Задача",
				component: () => import("@/views/Tasks/Index.vue"),
				meta: { requiresAuth: false, rights: { mh_photobank: 1 } },
			},
		],
	},
	{
		path: "/:catchAll(.*)",
		name: "404",
		component: () => import("@/views/404Page.vue"),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes: routes
});





export default router;