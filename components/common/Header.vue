<template>
  <v-app-bar
    fixed
    app
    class="header"
  >
    <v-container class="def-container" fluid>
      <v-row align="center">
        <v-col>
          <nuxt-link class="logo" :to="localePath('/')">{{$t('cinema')}}</nuxt-link>
        </v-col>
        <v-col cols="auto">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
                class="lang-btn"
              >
                {{langLocales[0].name}}
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(locale, i) in langLocales"
                v-if="i"
                :key="i"
                nuxt
                :to="switchLocalePath(locale.code)"
              >
                <v-list-item-title>{{locale.name}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: "Header",
  computed: {
    langLocales() {
      return [this.$i18n.locales.find(i => i.code === this.$i18n.locale), ...this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)]
    },
  }
}
</script>

<style lang="scss" scoped>
.logo {
  font-size: 18px;
  letter-spacing: 1px;
  text-decoration: none;
  transition: opacity 250ms ease;
  &:hover {
    opacity: 0.7;
  }
}
.lang-btn {
  text-transform: none;
  i {
    margin-left: 0;
  }
}
</style>
