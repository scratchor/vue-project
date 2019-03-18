<template>
  <div id="app">
    <transition name="fade">
      <router-view class="router"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  methods: {}
};
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Margarine');
#app {
  width: 100%;
}
body,
html {
  background-color: darkslategrey;
  width: 100%;
  margin: 0;
  font-family: 'Margarine', cursive;
}
::placeholder {
  color: #000;
  opacity: 1;
}

</style>
