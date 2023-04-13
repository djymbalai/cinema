export default function (context) {
  context.app.i18n.onLanguageSwitched = () => {
    context.store.dispatch('setLangStates', context);
  }
}
