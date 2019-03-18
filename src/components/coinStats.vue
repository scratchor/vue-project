<template>
  <div id="coinStats">
    <ring-loader
      class="ring-loader"
      :loading="loading"
      :size="size"
    ></ring-loader>
    <h1>{{ this.name }}</h1>
    <vue-load-image class="image">
      <img slot="image" :src="this.image" alt="coin image" />
      <img
        slot="preloader"
        style="width:50px; height:50px"
        src="./image-loader.gif"
        alt="coin image"
      />
      <div slot="error">Image Error</div>
    </vue-load-image>
    <div class="chart">
      <canvas id="myChart1"></canvas>
    </div>
    <div class="chart">
      <canvas id="myChart2"></canvas>
    </div>
    <div class="chart">
      <canvas id="myChart3"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js';
import VueLoadImage from 'vue-load-image';
import RingLoader from 'vue-spinner/src/RingLoader.vue';
export default {
  components: {
    'vue-load-image': VueLoadImage,
    'ring-loader': RingLoader
  },
  data() {
    return {
      id: this.$route.params.id,
      name: '',
      dates: [],
      currentPrices: [],
      marketCap: [],
      totalVolume: [],
      image: '',
      loading: true,
      size: '200px'
    };
  },
  computed: {},
  created() {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    const twelveMonth = [];
    const twelveYear = [];
    for (let i = 0; i < 5; i++) {
      let m = currentMonth - 1;
      currentMonth--;
      if (m === 0) {
        m = 12;
        currentMonth = 12;
        currentYear -= 1;
      }
      twelveMonth.push(m);
      twelveYear.push(currentYear);
    }
    twelveMonth.forEach((e, i) => {
      this.dates.push(`01-${e}-${twelveYear[i]}`);
    });
    twelveMonth.forEach((e, i) => {
      this.$http
        .get(
          `https://api.coingecko.com/api/v3/coins/${
            this.id
          }/history?date=01-${e}-${twelveYear[i]}&localization=false`
        )
        .then(data => {
          console.log(data.body);
          this.currentPrices[i] =
            Math.trunc(data.body.market_data.current_price.usd * 10000) / 10000;
          this.marketCap[i] = Math.round(data.body.market_data.market_cap.usd);
          this.totalVolume[i] = Math.round(
            data.body.market_data.total_volume.usd
          );
          this.image = data.body.image.small;
          this.name = data.body.name;
          console.log(this._data);
          if (this.currentPrices.length >= 2) {
            setTimeout(() => {
              this.buildCharts();
              this.ringLoader(false);
            }, 2000);
          }
        })
        .catch(error => console.log(error));
    });
  },
  methods: {
    ringLoader: function(bool) {
      this.loading = bool;
    },
    buildCharts: function() {
      Chart.defaults.global.defaultFontFamily = 'Lato';
      Chart.defaults.global.defaultFontSize = 15;
      Chart.defaults.global.defaultFontColor = '#777';
      const ctx1 = document.getElementById('myChart1').getContext('2d');
      const ctx2 = document.getElementById('myChart2');
      const ctx3 = document.getElementById('myChart3');
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              label: 'Market Capitalization',
              data: this.marketCap,
              borderColor: 'red',
              pointBorderWidth: 3,
              pointBorderColor: '#000',
              pointHoverBorderColor: 'green',
              pointHoverBorderWidth: 3
            }
          ]
        },
        options: {
          legend: {
            display: true,
            labels: {
              fontSize: 20
            }
          }
        }
      });
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              label: 'Total Volume',
              data: this.totalVolume,
              borderColor: 'purple',
              pointBorderWidth: 3,
              pointBorderColor: '#000'
            }
          ]
        },
        options: {
          legend: {
            display: true,
            labels: {
              fontSize: 20
            }
          }
        }
      });
      new Chart(ctx3, {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              label: 'Current Prices',
              data: this.currentPrices,
              borderColor: 'yellow',
              pointBorderWidth: 3,
              pointBorderColor: '#000'
            }
          ]
        },
        options: {
          legend: {
            display: true,
            labels: {
              fontSize: 20
            }
          }
        }
      });
    }
  }
};
</script>
<style scoped>
h1 {
  text-align: center;
  color: white;
}
.chart {
  margin: 100px auto;
  width: 60%;
}
.image {
  text-align: center;
}
.ring-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
