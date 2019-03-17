import Vue from 'vue';
import Router from 'vue-router';
import coinList from './components/coinsList.vue';
import coinStats from './components/coinStats.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: coinList
    },
    {
      path: '/coin/:id',
      name: 'home',
      component: coinStats
    }
  ]
});
