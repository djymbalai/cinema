<template>
  <div class="movie-card">
    <div class="movie-card-img">
      <img :src="info.image" :alt="info.name">
    </div>
    <div class="movie-card-name mt-2">
      {{info.name}}
    </div>
    <nuxt-link class="movie-card-link" :to="localePath(`/movie/${info.id}`)"></nuxt-link>
    <div class="movie-card-genre" @click="filterBygenre">{{genre}}</div>
  </div>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    genre() {
      return this.$store.getters.getGenres.find(item => item.id === this.info.genre).name
    }
  },
  methods: {
    filterBygenre() {
      this.$emit('filterBygenre', this.info.genre)
    }
  }
}
</script>

<style lang="scss" scoped>
.movie-card {
  display: block;
  position: relative;
  .movie-card-link {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .movie-card-genre {
    position: absolute;
    left: 15px;
    top: 15px;
    transition: opacity 250ms ease;
    color: #fff;
    cursor: pointer;
    opacity: 0;
  }
  .movie-card-img {
    position: relative;
    padding-bottom: 137%;
    background-color: #000;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 250ms ease;
    }
  }
  .movie-card-name {
    transition: color 250ms ease;
  }
  &:hover {
    .movie-card-img img {
      opacity: 0.5;
    }
    .movie-card-genre {
      opacity: 1;
      &:hover {
        opacity: 0.7;
      }
    }
    .movie-card-name {
      color: #1976d2;
    }
  }
}
</style>
