<template>
  <v-footer
    class="justify-center"
    absolute
    app
  >
    <span>{{$t('cinema')}} &copy; {{new Date().getFullYear()}}</span>
  </v-footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>

</style>
