<template>
  <div class="movies-page-wrap">
    <div class="movies-filters-wrap pt-4 pb-8">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            :label="$t('searchByTitle')"
            v-model="searchModel.name"
            clearable
            dense
            solo
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
            :label="$t('searchByGenre')"
            v-model="searchModel.genres"
            :items="$store.getters.getGenres"
            item-text="name"
            item-value="id"
            clearable
            dense
            solo
            hide-details
          ></v-autocomplete>
        </v-col>
      </v-row>
    </div>
    <div class="movies-list-wrap pb-4">
      <v-row v-if="list.length">
        <v-col cols="12" sm="6" md="3" lg="2" v-for="item in list " :key="item.id">
          <movie-card :info="item" @filterBygenre="filterBygenre" />
        </v-col>
      </v-row>
      <div class="no-data text-center mt-12" v-else>
        {{$t('notFound')}}
      </div>
    </div>
  </div>
</template>

<script>
import _debounce from 'lodash/debounce';
import MovieCard from '@/components/movies/MovieCard';

export default {
  components: {
    MovieCard
  },
  async asyncData({ $axios, route }) {
    const params = {}
    async function getMovies () {
      try {
        if(route.query.name) {
          params.name = route.query.name;
        }
        if(route.query.genres || route.query.genres === '0') {
          params.genres = route.query.genres;
        }
        const { data } = await $axios.get('/movies', { params })
        return data.data
      } catch (err) {
        console.log('error', err)
      }
      return []
    }
    return {
      list: await getMovies(),
      searchModel: {
        name: params.name || null,
        genres: params.genres ? Number(params.genres) : null
      }
    }
  },
  data() {
    return {
      loading: false,
      searchModel: {
        name: null,
        genres: null
      },
    }
  },
  watch: {
    searchModel: {
      handler: _debounce(function() {
        this.getMovies();
      }, 400),
      deep: true
    }
  },
  methods: {
    setUrlParams(params) {
      this.$router.replace({
        query: params
      }).catch(()=>{});
    },
    getMovies() {
      this.loading = true;
      const params = {};
      if(this.searchModel.name) {
        params.name = this.searchModel.name;
      }
      if(this.searchModel.genres || this.searchModel.genres === 0) {
        params.genres = this.searchModel.genres;
      }
      this.setUrlParams(params);
      this.$axios.get('/movies', { params })
        .then(res => {
          if(res.status === 200) {
            this.list = res.data.data;
          }
        })
        .catch(err => {
          console.log('error', err);
        })
        .then(() => {
          this.loading = false;
        })
    },
    filterBygenre(val) {
      this.searchModel = {
        name: null,
        genres: val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.no-data {
  font-size: 24px;
  line-height: 28px;
}
</style>
