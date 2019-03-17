<template>
  <div id="coinsList">
    <ring-loader
      class="ring-loader"
      :loading="loading"
      :size="size"
    ></ring-loader>
    <h1>COINS</h1>
    <div class="search_info">
      <div>
        <span><strong>Search</strong></span>
        <input v-model="coins.search" type="text" placeholder="search coin" />
      </div>
      <div>
        <span><strong>Items on page</strong></span>
        <input
          v-model="coins.size"
          class="coinsSize"
          type="number"
          max="50"
          value="10"
          size="10"
          placeholder="1-50"
        />
      </div>
      <div>
        <span><strong>Sort by:</strong></span>
        <select v-model="coins.sorti">
          <option value="nothing" selected></option>
          <option value="id">ID</option>
          <option value="name">NAME</option>
          <option value="marketRank">MARKET RANK</option>
          <option value="coingeckoRank">COINGESCKO RANK</option>
        </select>
      </div>
      <div>
        <span><strong>Sorting order</strong></span>
        <select v-model="coins.sortiMethod">
          <option value="ascending" selected>ASCENDING</option>
          <option value="descending">DESCENDING</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <td>IMAGE</td>
          <td>ID</td>
          <td>NAME</td>
          <td>MARKET RANK</td>
          <td>COINGESCKO RANK</td>
          <td>HOMEPAGE</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in filterCoins" :key="coin.id">
          <td>
            <router-link :to="'/coin/' + coin.id">
              <vue-load-image>
                <img slot="image" :src="coin.image" alt="coin image" />
                <img
                  slot="preloader"
                  style="width:50px; height:50px"
                  src="./image-loader.gif"
                  alt="coin image"
                />
                <div slot="error">Image Error</div>
              </vue-load-image>
            </router-link>
          </td>
          <td>
            <router-link :to="'/coin/' + coin.id">{{ coin.id }}</router-link>
          </td>
          <td>
            <router-link :to="'/coin/' + coin.id">{{ coin.name }}</router-link>
          </td>
          <td>{{ coin.marketRank }}</td>
          <td>{{ coin.coingeckoRank }}</td>
          <td>
            <a :href="coin.homepage">{{ coin.homepage }}</a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons_wrapper">
      <button class="push_button red" @click="prev">Prev</button>
      <button class="push_button blue" @click="next">Next</button>
    </div>
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
      coins: {
        fullCoins: [],
        search: '',
        size: '10',
        sorti: '',
        sortiMethod: 'ascending',
        currentPage: '1'
      },
      size: '200px',
      loading: true
    };
  },
  computed: {
    filterCoins: function() {
      console.log(this.coins.sorti);
      this.ringLoader(true);
      // filter for search
      let arr = this.coins.fullCoins.filter(e => {
        return e.name.match(this.coins.search);
      });

      // sort by id and name
      if (this.coins.sorti === 'id' || this.coins.sorti === 'name') {
        const i = this.coins.sorti;
        if (this.coins.sortiMethod === 'ascending') {
          arr.sort((a, b) => {
            if (a[i].toLowerCase() < b[i].toLowerCase()) return -1;
            if (a[i].toLowerCase() > b[i].toLowerCase()) return 1;
            return 0;
          });
        } else if (this.coins.sortiMethod === 'descending') {
          arr.sort((a, b) => {
            if (a[i].toLowerCase() < b[i].toLowerCase()) return 1;
            if (a[i].toLowerCase() > b[i].toLowerCase()) return -1;
            return 0;
          });
        }
        // sort by marketRank and coingeckoRank
      } else if (
        this.coins.sorti === 'marketRank' ||
        this.coins.sorti === 'coingeckoRank'
      ) {
        if (this.coins.sortiMethod === 'ascending') {
          const i = this.coins.sorti;
          arr.sort((a, b) => {
            return a[i] - b[i];
          });
        } else if (this.coins.sortiMethod === 'descending') {
          const i = this.coins.sorti;
          arr.sort((a, b) => {
            return b[i] - a[i];
          });
        }
      }

      // items on the page
      if (this.coins.size > 50) {
        this.coins.size = 50;
      }
      arr = arr.splice(
        +this.coins.currentPage * +this.coins.size - +this.coins.size,
        +this.coins.size
      );
      console.log(
        +this.coins.currentPage * +this.coins.size - +this.coins.size,
        +this.coins.size
      );
      if (arr.length > 0) {
        arr.forEach(e => {
          if (!e.loadInfo) {
            // download the necessity information
            this.ringLoader(true);
            this.$http
              .get(
                // eslint-disable-next-line prettier/prettier
                            `https://api.coingecko.com/api/v3/coins/${e.id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
              )
              .then(info => {
                e.homepage = info.body.links.homepage[0];
                e.image = info.body.image.small;
                e.marketRank = info.body.market_cap_rank;
                e.coingeckoRank = info.body.coingecko_rank;
                e.loadInfo = true;
                this.$forceUpdate();
                setTimeout(() => {
                  this.ringLoader(false);
                }, 1000);
              });
          } else {
            this.ringLoader(false);
          }
        });
      } else {
        this.ringLoader(false);
      }
      return arr;
    }
  },
  beforeCreate() {
    this.$http.get('https://api.coingecko.com/api/v3/coins/list').then(data => {
      this.coins.fullCoins = data.body;
      this.coins.showCoins = data.body.slice().splice(0, 50);
      console.log(this.coins.fullCoins);
      console.log('showCoins', this.coins.showCoins);
      return this.coins.showCoins;
    });
    // .then(data => {
    //   data.forEach((e, i) => {
    //     this.$http
    //       .get(
    //         // eslint-disable-next-line prettier/prettier
    //         `https://api.coingecko.com/api/v3/coins/${ e.id }?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
    //       )
    //       .then(info => {
    //         e.homepage = info.body.links.homepage[0];
    //         e.image = info.body.image.small;
    //         e.marketRank = info.body.market_cap_rank;
    //         e.coingeckoRank = info.body.coingecko_rank;
    //         e.loadInfo = true;
    //         if (i === 49) {
    //           this.$forceUpdate();
    //           setTimeout(() => {
    //             this.loading2 = false;
    //             this.loading = false;
    //           }, 500);
    //         }
    //       });
    //   });
    // });
  },
  methods: {
    ringLoader: function(bool) {
      this.loading = bool;
    },
    prev: function() {
      if (this.coins.currentPage <= 1) {
        return false;
      }
      this.coins.currentPage = +this.coins.currentPage - 1;
      console.log(+this.coins.currentPage);
    },
    next: function() {
      this.coins.currentPage = +this.coins.currentPage + 1;
      console.log(+this.coins.currentPage);
    }
  }
};
</script>
<style scoped>
.search_info div {
  width: 20%;
  display: inline-block;
  text-align: center;
  margin-right: 6.66%;
  box-sizing: border-box;
}
.search_info div:last-child {
  margin: 0;
}

.search_info {
  width: 90%;
  margin: 50px auto;
}
input {
  width: 100%;
  margin-right: 10%;
  box-sizing: border-box;
  border: 2px solid black;
  border-radius: 5px;
}
.coinsSize {
  width: 100%;
}
select {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid black;
  border-radius: 5px;
}
.ring-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
h1 {
  text-align: center;
}
a {
  color: black;
  text-decoration: none;
}
table {
  width: 90%;
  margin: 0 auto;
  vertical-align: middle;
  text-align: center;
  border: 2px solid black;
  border-collapse: collapse;
}
img {
  width: 80%;
}
td {
  border: 1px solid black;
}
body {
  background-color: darkslategrey;
}
thead {
  color: white;
  font-weight: bold;
}
.push_button {
  position: relative;
  width: 100px;
  height: 40px;
  text-align: center;
  color: #fff;
  text-decoration: none;
  line-height: 43px;
  font-family: 'Oswald', Helvetica;
  display: inline-block;
  margin: 30px;
}
.buttons_wrapper {
  margin: 0 auto;
  width: 50%;
  text-align: center;
}
.push_button:before {
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) inset, 0 1px 0 #fff;
  position: absolute;
  content: '';
  left: -6px;
  right: -6px;
  top: -6px;
  bottom: -10px;
  z-index: -1;
}

.push_button:active {
  top: 5px;
}
.push_button:active:before {
  top: -11px;
  bottom: -5px;
  content: '';
}

.red {
  text-shadow: -1px -1px 0 #a84155;
  background: #c32f2f;
  border: 1px solid #d25068;
  background-image: linear-gradient(to bottom, #f66c7b, #d25068);
  border-radius: 5px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 -1px 0 rgba(255, 255, 255, 0.1) inset, 0 4px 0 #ad4257,
    0 4px 2px rgba(0, 0, 0, 0.5);
}

.red:hover {
  background: #f66c7b;
  background-image: linear-gradient(top, #d25068, #f66c7b);
}

.blue {
  text-shadow: -1px -1px 0 #2c7982;
  background: #3eacba;
  border: 1px solid #379aa4;
  background-image: linear-gradient(top, #48c6d4, #3eacba);
  border-radius: 5px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 -1px 0 rgba(255, 255, 255, 0.1) inset, 0 4px 0 #338a94,
    0 4px 2px rgba(0, 0, 0, 0.5);
}

.blue:hover {
  background: #48c6d4;
  background-image: linear-gradient(top, #3eacba, #48c6d4);
}
</style>
