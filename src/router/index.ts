import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
} from "vue-router";
import { useUserStore } from "@/stores/user";
import { envConfig } from "@/plugins/envConfig";

interface rightsObj {
  [key: string]: any;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Главная",
      component: () => import("@/views/DefaultLayout.vue"),
      meta: { requiresAuth: true, rights: { mh_photobank_front: 2 } },
      children: [
        {
          path: "/kanban",
          name: "Доска",
          component: () => import("@/views/Kanban/Index.vue"),
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
  ],
});
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  userStore.showLoader();
  if (to.query.auth) {
    console.log("cookie exist");
    document.cookie = `connect.sid=${to.query.auth};path=/;expires=${new Date(
      Date.now() + 86400000
    ).toUTCString()}`;
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (userStore.is_auth) {
      return chechRights(userStore, to.meta.rights as rightsObj, next);
    }
    return userStore.checkAuth().then((res) => {
      if (res) {
        return chechRights(userStore, to.meta.rights as rightsObj, next);
      } else {
        window.location.href = `${envConfig.CLIENT_COOKIE}/auth_service?redirect=http://${location.host}${to.fullPath}`;
      }
    });
  } else {
    userStore.hideLoader();
    next();
  }
});
function chechRights(
  userStore: any,
  rightsObj: rightsObj,
  next: NavigationGuardNext
) {
  const rights = userStore.getRights;
  let access = true;
  for (const prop in rightsObj) {
    if (!rights[prop] || rights[prop] < rightsObj[prop]) {
      access = false;
      break;
    }
  }
  userStore.hideLoader();
  return access ? next() : next({ path: "401" });
}
export default router;
