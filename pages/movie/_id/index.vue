<template>
  <div v-if="info" class="film-info pt-3 pb-4">
    <v-breadcrumbs class="pl-0 pt-0 pr-0" :items="breadcrumbs"></v-breadcrumbs>
    <v-row>
      <v-col class="film-info-lc">
        <div class="film-info-img">
          <img :src="info.image" :alt="info.name">
        </div>
      </v-col>
      <v-col class="film-info-mc">
        <div class="fil-info-content">
          <h2 class="film-info-ttl">{{info.name}}</h2>
          <div class="film-info-description mt-4" v-html="info.additional"></div>
          <div class="film-info-additional-list mt-5" v-html="info.description"></div>
        </div>
      </v-col>
      <v-col class="film-info-rc">
        <v-card elevation="4" class="film-info-sessions pa-4">
          <div class="fis-ttl mb-4">{{$t('sessionSchedule')}}</div>
          <div class="sessions-select-wrap">
            <v-select
              :value="currentSession"
              :items="sessions"
              @change="selectHandler"
              attach=".sessions-select-wrap"
              item-text="showdate"
              item-value="showdate"
              label="Choose date"
              solo
              dense
              hide-details
            ></v-select>
          </div>
          <div v-if="currentSession" class="session-time mt-4">
            <v-btn
              text
              nuxt
              v-for="(item, index) in currentSession.daytime" :key="index"
              :to="localePath(`/movie/book/${$route.params.id}?showdate=${currentSession.showdate}&daytime=${item}`)"
              class="time-btn"
            >
              {{item}}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "index",
  async asyncData(context) {
    async function getMovie () {
      try {
        if(!/^\d+$/.test(context.route.params.id)) {
          context.error({statusCode: 404});
        }
        const params = {
          movie_id: context.route.params.id
        }
        const { data } = await context.$axios.get('/movies', { params })
        if(data.data?.length !== 1 ) {
          context.error({statusCode: 404});
        }
        return data.data?.length ? data.data[0] : null
      } catch (err) {
        console.log('error', err)
      }
      return null
    }
    return {
      info: await getMovie()
    }
  },
  head() {
    return {
      title: this.info.name
    }
  },
  data() {
    return {
      breadcrumbs: [],
      sessions: [],
      currentSession: null
    }
  },
  computed: {
    genre() {
      return this.$store.getters.getGenres.find(item => item.id === this.info.genre).name
    }
  },
  beforeMount() {
    this.getMovieSession();
    this.setBreadcrumbs();
  },
  mounted() {
    this.setGenre();
  },
  methods: {
    setGenre() {
      const genreParentNode = this.$el.querySelector('.film-info-description a')?.closest('.val');
      if(genreParentNode) {
        const genreLink = document.createElement('a');
        genreLink.href = `/?genres=${this.info.genre}`;
        genreLink.textContent = this.genre;
        genreLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.$router.push(this.localePath(`/?genres=${this.info.genre}`));
        });
        genreParentNode.innerHTML = '';
        genreParentNode.appendChild(genreLink);
      }
    },
    setBreadcrumbs() {
      this.breadcrumbs = [
        {
          text: this.$t('main'),
          exact: true,
          disabled: false,
          to: this.localePath('/')
        },
        {
          text: this.info.name,
          disabled: true
        }
      ]
    },
    selectHandler(val) {
        this.currentSession = this.sessions.filter(item => item.showdate === val)[0];
    },
    getMovieSession() {
      let params = {
        movie_id: this.$route.params.id
      };
      this.$axios.get('/movieShows', { params })
        .then(res => {
          if(res.status === 200) {
            this.sessions = this.normalizeSession(res.data.data[this.$route.params.id]);
            this.currentSession = this.sessions[0];
          }
        })
        .catch(err => {
          console.log('error', err);
        })
    },
    normalizeSession(data) {
      if(data.length) {
        data.forEach(item => {
          item.daytime = item.daytime.split(';');
        })
      }
      return data;
    }
  },
}
</script>

<style lang="scss">
.film-info-description {
  ul {
    list-style: none;
    padding: 0;
    font-size: 15px;
    line-height: 20px;
    p {
      margin-bottom: 0;
    }
    li {
      display: flex;
      margin-bottom: 10px;
      .key {
        flex: 0 0 180px;
        max-width: 180px;
        width: 100%;
        padding-right: 15px;
        font-weight: 600;
      }
      .val {
        flex: 0 0 calc(100% - 180px);
        max-width: calc(100% - 180px);
        width: 100%;
        a {
          text-decoration: none;
          transition: opacity 250ms ease;
          &:hover {
            opacity: 0.7;
          }
        }
      }
      .age_hint {
        display: none;
      }
    }
  }
}
.film-info-additional-list {
  font-size: 15px;
  line-height: 24px;
  list-style: none;
}
</style>

<style lang="scss" scoped>
.film-info-ttl {
  font-size: 26px;
  font-weight: 700;
}
.film-info-lc {
  flex: 0 0 300px;
  max-width: 300px;
  @media screen and (max-width: 1200px)  {
    flex: 0 0 250px;
    max-width: 250px;
  }
  @media screen and (max-width: 960px)  {
    flex: 0 0 100%;
    max-width: 100%;
    order: 1;
  }
}
.film-info-rc {
  flex: 0 0 380px;
  max-width: 380px;
  @media screen and (max-width: 1200px)  {
    flex: 0 0 280px;
    max-width: 280px;
  }
  @media screen and (max-width: 960px)  {
    flex: 0 0 100%;
    max-width: 100%;
    order: 2;
  }
}
.film-info-mc {
  word-break: break-word;
  @media screen and (max-width: 960px)  {
    order: 3;
  }
}
.film-info-img {
  position: sticky;
  top: 92px;
  img {
    width: 100%;
    @media screen and (max-width: 960px)  {
      max-height: 400px;
      object-fit: cover;
    }
  }
}
.film-info-sessions {
  position: sticky;
  top: 92px;
}
.time-btn.v-btn {
  padding-left: 10px;
  padding-right: 10px;
}
.fis-ttl {
  font-size: 18px;
  font-weight: 600;
}
.sessions-select-wrap {
  position: relative;
}
</style>
