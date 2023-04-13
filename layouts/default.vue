<template>
  <v-app dark>
    <Header/>
    <v-main>
      <v-container class="def-container" fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default {
  components: {
    Header,
    Footer
  },
  data () {
    return {

    }
  }
}
</script>
