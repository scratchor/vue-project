<template>
  <div id="coinsList">
    <ring-loader
      class="ring-loader"
      :loading="loading"
      :size="size"
    ></ring-loader>
    <h1>CRYPTOCURRENCY</h1>
    <div class="search_info">
      <div>
        <span><strong>Search</strong></span>
        <input
          v-model="coins.search"
          type="text"
          placeholder="search by name"
        />
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
        <span><strong>Sorting order</strong></span>
        <select v-model="coins.sortiMethod">
          <option value="ascending" selected>ASCENDING</option>
          <option value="descending">DESCENDING</option>
        </select>
      </div>
      <div>
        <span><strong>Sort by:</strong></span>
        <select v-model="coins.sorti">
          <option value="nothing" selected></option>
          <option value="id">ID</option>
          <option value="name">NAME</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th class="tdImage">IMAGE</th>
          <th class="tdId">ID</th>
          <th class="tdName">NAME</th>
          <th class="tdMarket">MARKET RANK</th>
          <th class="tdCoingecko">COINGESCKO RANK</th>
          <th class="tdHomepage">HOMEPAGE</th>
          <th class="tdLink"></th>
        </tr>
      </thead>
      <transition-group
        name="zoom"
        enter-active-class="zoomInLeft"
        leave-active-class="zoomOutRight"
        :duration="{ enter: 1000, leave: 500 }"
        tag="tbody"
      >
        <tr v-for="coin in filterCoins" :key="coin.id">
          <td class="tdImage">
            <router-link :to="'/coin/' + coin.id">
              <vue-load-image class="image">
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
          <td class="tdId">
            <router-link :to="'/coin/' + coin.id">{{ coin.id }}</router-link>
          </td>
          <td class="tdName">
            <router-link :to="'/coin/' + coin.id">{{ coin.name }}</router-link>
          </td>
          <td class="tdMarket">{{ coin.marketRank }}</td>
          <td class="tdCoingecko">{{ coin.coingeckoRank }}</td>
          <td class="tdHomepage">
            <a :href="coin.homepage">{{ coin.homepage }}</a>
          </td>
          <td class="tdLink">
            <router-link :to="'/coin/' + coin.id"
              ><i class="fas fa-arrow-alt-circle-right"></i
            ></router-link>
          </td>
        </tr>
      </transition-group>
    </table>
    <div class="buttons_wrapper">
      <button class="push_button red redFreeze hidden" @click="prev">
        Prev
      </button>
      <button class="push_button blue" @click="next">Next</button>
    </div>
  </div>
</template>

<script>
import VueLoadImage from 'vue-load-image';
import RingLoader from 'vue-spinner/src/RingLoader.vue';
require('vue2-animate/dist/vue2-animate.min.css');
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
              })
              .catch(error => console.log(error));
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
      return this.coins.showCoins;
    });
  },
  methods: {
    ringLoader: function(bool) {
      this.loading = bool;
    },
    prev: function() {
      this.coins.currentPage = +this.coins.currentPage - 1;
      if (this.coins.currentPage <= 1) {
        const button = document.querySelector('.redFreeze');
        button.classList.add('hidden');
      }
    },
    next: function() {
      this.coins.currentPage = +this.coins.currentPage + 1;
      if (this.coins.currentPage > 1) {
        const button = document.querySelector('.redFreeze');
        button.classList.remove('hidden');
      }
    }
  }
};
</script>
<style scoped>
#coinsList {
  width: 100%;
  min-width: 295px;
}
.tdId,
.tdName,
.tdMarket,
.tdCoingecko,
.tdHomepage {
  width: 15%;
}
.tdImage {
  width: 10%;
}
.tdLink {
  width: 5%;
}
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
  height: 25px;
  box-sizing: border-box;
  border: 2px solid black;
  font-family: 'Margarine', cursive;
  border-radius: 5px;
  background-color: #52a752;
}
.coinsSize {
  width: 100%;
}
select {
  width: 100%;
  height: 25px;
  box-sizing: border-box;
  border: 2px solid black;
  border-radius: 5px;
  font-family: 'Margarine', cursive;
  background-color: #52a752;
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
  box-sizing: border-box;
  border-radius: 10px;
  border-collapse: separate;
  border-spacing: 5px;
}
.image img {
  width: 50px;
  height: 50px;
  border: 1px solid white;
  border-radius: 50px;
  vertical-align: middle;
  text-align: center;
}
td,
th {
  font-size: 20px;
  height: 50px;
  background: #b73924;
}

th {
  font-size: 20px;
}

th:first-child {
  border-top-left-radius: 5px;
}
th:last-child {
  border-top-right-radius: 5px;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 5px;
}

tr:last-child td:last-child {
  border-bottom-right-radius: 5px;
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
  font-family: 'Margarine', cursive;
  color: #fff;
  text-decoration: none;
  line-height: 43px;
  display: inline-block;
  margin: 30px;
  cursor: pointer;
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

.redFreeze:active:before {
  top: -11px;
  bottom: -5px;
  content: '';
}

.fas {
  font-size: 1.2em;
}

.redFreeze:active {
  top: 5px;
}
.red {
  text-shadow: -1px -1px 0 #a84155;
  background: #c32f2f;
  border: 1px solid #000;
  background-image: linear-gradient(to bottom, #020202, #ff0808);
  border-radius: 5px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 -1px 0 rgba(255, 255, 255, 0.1) inset, 0 4px 0 #1e2425,
    0 4px 2px rgba(0, 0, 0, 0.5);
}

.redFreeze:hover {
  background: #f66c7b;
  background-image: linear-gradient(top, #d25068, #f66c7b);
}

.blue {
  text-shadow: -1px -1px 0 #2c7982;
  background: #3eacba;
  border: 1px solid #000;
  background-image: linear-gradient(top, #191919, #37c137);
  border-radius: 5px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 -1px 0 rgba(255, 255, 255, 0.1) inset, 0 4px 0 #1e2425,
    0 4px 2px rgba(0, 0, 0, 0.5);
}

.blue:active:before {
  top: -11px;
  bottom: -5px;
  content: '';
}

.blue:active {
  top: 5px;
}

.blue:hover {
  background: #48c6d4;
  background-image: linear-gradient(top, #3eacba, #48c6d4);
}
.hidden {
  display: none;
}

@media (max-width: 830px) {
  .tdCoingecko,
  .tdMarket {
    display: none;
  }
  td {
    font-size: 18px;
    height: 50px;
  }
}
@media (max-width: 700px) {
  .search_info div {
    width: 50%;
    display: inline-block;
    text-align: center;
    margin: 30px 0;
    box-sizing: border-box;
  }
  input {
    width: 90%;
  }
  .coinsSize {
    width: 90%;
  }
  select {
    width: 90%;
  }

  .buttons_wrapper {
    width: 100%;
  }
  .push_button {
    margin: 30px 50px;
  }
  .fas {
    font-size: 2em;
  }
}
@media (max-width: 600px) {
  td {
    font-size: 15px;
    height: 50px;
  }
}
@media (max-width: 520px) {
  .search_info div {
    width: 100%;
    display: inline-block;
    text-align: center;
    margin: 30px auto;
    box-sizing: border-box;
  }
  .search_info div:last-child {
    margin: 30px auto;
  }
  .tdHomepage {
    display: none;
  }
  .fas {
    font-size: 2.5em;
  }
  .push_button {
    margin: 30px 50px;
  }
}
@media (max-width: 520px) {
  .push_button {
    margin: 30px 20px;
  }
}
</style>
