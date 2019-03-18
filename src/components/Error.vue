<template>
  <div id="coinStats">
    <ring-loader
      class="ring-loader"
      :loading="loading"
      :size="size"
    ></ring-loader>
    <h1>Upsss.. 404 ERROR</h1>
    <p>Page not found..</p>
    <vue-load-image class="image">
      <img slot="image" :src="this.image" alt="pitty cat" />
      <img
        slot="preloader"
        style="width:50px; height:50px"
        src="./image-loader.gif"
        alt="coin image"
      />
      <div slot="error">Image Error</div>
    </vue-load-image>
  </div>
</template>

<script>
import VueLoadImage from 'vue-load-image';
import RingLoader from 'vue-spinner/src/RingLoader.vue';
export default {
  components: {
    'vue-load-image': VueLoadImage,
    'ring-loader': RingLoader
  },
  data() {
    return {
      image:
        'https://cdnimg.rg.ru/img/content/135/37/51/ponchik-1000_d_850.jpg',
      loading: true,
      size: '200px'
    };
  },
  computed: {},
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  methods: {}
};
</script>
<style scoped>
h1 {
  text-align: center;
  font-size: 100px;
  color: white;
}
p {
  text-align: center;
  font-size: 50px;
  color: white;
}
.image {
  text-align: center;
  margin: 20px auto;
  overflow: hidden;
  width: 600px;
  height: 400px;
  border: 2px solid white;
  border-radius: 100px;
}
img {
  width: 100%;
  height: 100%;
}
.ring-loader {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (max-width: 700px) {
  .image {
    width: 70%;
    height: 300px;
  }
}
@media (max-width: 500px) {
  .image {
    width: 68%;
    height: 200px;
  }
}
</style>
