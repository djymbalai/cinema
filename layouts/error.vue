<template>
  <div class="error-section-wrap">
    <div class="error-section text-center">
      <h1 v-if="error.statusCode === 404">
        {{pageNotFound}}
      </h1>
      <h1 v-else>
        {{otherError}}
      </h1>
      <div class="mt-6">
        <NuxtLink class="home-link" :to="localePath('/')">
          {{$t('homePage')}}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: this.$t('pageNotFound'),
      otherError: this.$t('otherError')
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 40px;
}
.error-section-wrap {
  min-height: calc(100vh - 124px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.home-link {
  text-decoration: none;
  transition: opacity 250ms ease;
  &:hover {
    opacity: 0.7;
  }
}
</style>
