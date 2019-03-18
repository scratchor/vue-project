import Vue from 'vue';
import Router from 'vue-router';
import coinList from './components/coinsList.vue';
import coinStats from './components/coinStats.vue';
import Error from './components/Error.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'list',
      component: coinList
    },
    {
      path: '/coin/:id',
      name: 'coin',
      component: coinStats
    },
    {
      path: '/*',
      name: '404 Error',
      component: Error
    }
  ]
});
