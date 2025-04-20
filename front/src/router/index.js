import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TaskView from '../views/TaskView.vue';
import UsersView from '../views/UsersView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); 
  const isAdminRoute = to.meta.requiresAdmin;

  if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated) {
    // next('/login'); 
    next(); 
  } else if (isAdminRoute && (!isAuthenticated || false)) {
    next('/'); 
  } else {
    next(); 
  }
});

export default router;