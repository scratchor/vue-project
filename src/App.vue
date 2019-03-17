<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import coinsList from './components/coinsList.vue';
export default {
  components: {
    'coins-list': coinsList
  },
  data() {
    return {};
  },

  methods: {}
};
</script>
<style>
body {
  background-color: darkslategrey;
}
</style>
