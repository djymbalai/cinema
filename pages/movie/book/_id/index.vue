<template>
  <div v-if="info" class="film-book-info pt-3 pb-4">
    <v-breadcrumbs class="pl-0 pt-0 pr-0" :items="breadcrumbs"></v-breadcrumbs>
    <v-row>
      <v-col class="book-info-col">
        <v-row>
          <v-col class="film-book-info-img-col">
            <div class="film-book-info-img">
              <img :src="info.image" :alt="info.name">
            </div>
          </v-col>
          <v-col>
            <div class="fil-info-content">
              <h2 class="film-book-info-ttl">{{info.name}}</h2>
              <div class="film-book-info-date mt-4">
                <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                {{$route.query.showdate}}
              </div>
              <div class="film-book-info-date mt-4">
                <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                {{$route.query.daytime}}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="book-ticket-col">
        <v-card elevation="4" class="film-book-ticket-card pa-4">
          <div class="book-ticket-ttl">{{$t('ticket')}}</div>
          <div v-if="bookedPlace" class="pl-3 elevation-5">
            <v-row align="center" class="mt-4 mb-5">
              <v-col class="pt-2 pb-2">
                {{$t('row')}} {{bookedPlace.row}}, {{$t('seat')}} {{bookedPlace.seat}}
              </v-col>
              <v-col cols="auto" class="pt-2 pb-2">
                <v-btn
                  icon
                  @click="clearBookedPlace"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div v-else class="text-center mt-8 mb-8">
            {{$t('chooseSeat')}}
          </div>
          <v-btn
            color="primary"
            block
            :disabled="!bookedPlace"
            :loading="loading"
            @click="bookPlace"
          >
            {{$t('book')}}
          </v-btn>
        </v-card>
      </v-col>
      <v-col class="book-seats-col">
        <book-place v-model="bookedPlace" :places="places" />
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <div class="text-h5 text-break">{{$t('ticketBooked')}}</div>
        </v-card-title>
        <v-card-text class="result-dialog-cont mt-3" v-if="bookResult">
          <v-row>
            <v-col>
              <div class="film-book-info-date">
                <v-icon color="primary" class="mr-2">mdi-movie-open</v-icon>
                <div>
                  <strong class="mr-2">{{$t('title')}}:</strong>
                  {{info.name}}
                </div>
              </div>
              <div class="film-book-info-date mt-4">
                <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                <div>
                  <strong class="mr-2">{{$t('date')}}:</strong>
                  {{bookResult.showdate}}
                </div>
              </div>
              <div class="film-book-info-date mt-4">
                <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                <div>
                  <strong class="mr-2">{{$t('time')}}:</strong>
                  {{bookResult.daytime}}
                </div>
              </div>
              <div class="film-book-info-date mt-4">
                <v-icon color="primary" class="mr-2">mdi-format-list-numbered</v-icon>
                <div>
                  <strong class="mr-2">{{$t('row')}}:</strong>
                  {{bookResult.row}}
                </div>
              </div>
              <div class="film-book-info-date mt-4">
                <v-icon color="primary" class="mr-2">mdi-sofa-single</v-icon>
                <div>
                  <strong class="mr-2">{{$t('seat')}}:</strong>
                  {{bookResult.seat}}
                </div>
              </div>
            </v-col>
            <v-col class="result-qr-col">
              <qrcode-vue class="qr-item" :value="qrData" render-as="svg" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            {{$t('continue')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbarError"
      color="#D72C0D"
      timeout="5000"
    >
      {{snackbarErrorMessage}}
    </v-snackbar>
  </div>
</template>

<script>
import BookPlace from '@/components/movies/BookPlace';
import QrcodeVue from 'qrcode.vue';

export default {
  name: "index",
  components: {
    BookPlace,
    QrcodeVue
  },
  async asyncData(context) {
    function checkSessionParams() {
      const showDate = /^\d{4}-{1}\d{2}-{1}\d{2}$/.test(context.route.query.showdate);
      const dayTime = /^\d{2}:{1}\d{2}$/.test(context.route.query.daytime);
      const movieId = /^\d+$/.test(context.route.params.id);
      return showDate && dayTime && movieId;
    }
    async function getMovie () {
      try {
        if(!checkSessionParams()) {
          context.error({statusCode: 404});
          return;
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
        console.log('error', err);
        context.error({statusCode: 404});
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
      dialog: false,
      loading: false,
      breadcrumbs: [],
      places: [],
      bookedPlace: null,
      bookResult: null,
      snackbarError: false,
      snackbarErrorMessage: '',
    }
  },
  computed: {
    qrData() {
      let data = `${this.$t('title')}: ${this.info.name}\n`;
      data += `${this.$t('date')}: ${this.bookResult.showdate}\n`;
      data += `${this.$t('time')}: ${this.bookResult.daytime}\n`;
      data += `${this.$t('row')}: ${this.bookResult.row}\n`;
      data += `${this.$t('seat')}: ${this.bookResult.seat}`;
      return data;
    }
  },
  watch: {
    dialog(val) {
      if(!val) {
        this.bookResult = null;
      }
    }
  },
  beforeMount() {
    this.getSessionPlaces();
    this.setBreadcrumbs();
  },
  methods: {
    setSnackbarError(message) {
      this.snackbarError = true;
      this.snackbarErrorMessage = message;
    },
    clearBookedPlace() {
      this.bookedPlace = null;
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
          exact: true,
          disabled: false,
          to: this.localePath(`/movie/${this.info.id}`)
        },
        {
          text: this.$t('booking'),
          disabled: true
        },
      ]
    },
    getSessionPlaces() {
      const params = {
        movie_id: this.$route.params.id,
        daytime: this.$route.query.daytime,
        showdate: this.$route.query.showdate
      };
      this.$axios.get('/showPlaces', { params })
        .then(res => {
          if(res.status === 200) {
            this.places = res.data.data;
          }
        })
        .catch(err => {
          console.log('error', err);
        })
    },
    bookPlace() {
      if(!this.bookedPlace) {
        return;
      }
      this.loading = true;
      const data = {
        movie_id: Number(this.$route.params.id),
        daytime: this.$route.query.daytime,
        showdate: this.$route.query.showdate,
        row: this.bookedPlace.row,
        seat: this.bookedPlace.seat
      };
      this.$axios.post('/bookPlace', data, {})
        .then(res => {
          if(res.status === 200) {
            this.bookResult = res.data.data;
            this.showBookResult();
          }
        })
        .catch(err => {
          console.log('error', err);
          this.setSnackbarError(this.$t('bookError'));
        })
        .then(() => {
          this.loading = false;
        })
    },
    showBookResult() {
      this.clearBookedPlace();
      this.getSessionPlaces();
      this.dialog = true;
    }
  }
}
</script>

<style lang="scss">
.qr-item {
  svg {
    width: 100%!important;
    height: auto!important;
  }
}
</style>

<style lang="scss" scoped>
.book-ticket-col {
  flex: 0 0 380px;
  max-width: 380px;
  @media screen and (max-width: 1200px)  {
    flex: 0 0 280px;
    max-width: 280px;
  }
  @media screen and (max-width: 960px)  {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
.book-seats-col {
  flex: 0 0 100%;
  max-width: 100%;
}
.film-book-info-img-col {
  flex: 0 0 150px;
  max-width: 150px;
}
.film-book-info-img {
  img {
    width: 100%;
  }
}
.film-book-info-ttl {
  font-size: 24px;
  line-height: 30px;
}
.film-book-info-date {
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 20px;
  word-break: break-word;
}
.book-ticket-ttl {
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
}
.result-dialog-cont {
  color: #000!important;
}
.result-qr-col {
  flex: 0 0 220px;
  max-width: 220px;
  @media screen and (max-width: 575px)  {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
