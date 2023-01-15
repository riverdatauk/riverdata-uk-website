import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './HomePage.vue';
import NotFoundPage from './NotFoundPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./about/AboutPage.vue'),
    },
    {
      path: '/station/:id',
      name: 'station',
      component: () => import('./station/StationPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundPage,
    },
  ],
});

export default router;
