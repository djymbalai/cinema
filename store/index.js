export const state = () => ({
  genres: []
})

export const getters = {
  getGenres(state) {
    return state.genres
  }
}

export const mutations = {
  setGenres(state, context) {
    state.genres = [
      {id: 0, name: context.app.i18n.t('action')},
      {id: 1, name: context.app.i18n.t('adventures')},
      {id: 2, name: context.app.i18n.t('comedy')},
      {id: 3, name: context.app.i18n.t('drama')},
      {id: 4, name: context.app.i18n.t('horror')},
      {id: 5, name: context.app.i18n.t('westerns')}
    ];
  }
}

export const actions = {
  setLangStates({commit}, context) {
    commit('setGenres', context);
  },
  async nuxtServerInit({dispatch}, context) {
    dispatch('setLangStates', context);
  }
};
