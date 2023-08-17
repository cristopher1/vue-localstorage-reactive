import { createReactiveStorage } from './reactiveStorage'

export default {
  /**
   * @param {App<Element>} app - Instance of createApp
   * @param {{useRefStorage: Boolean,
   * useLoadDataFromLocalStorage: Boolean,
   * useRemoveItemFromLocalStorage: Boolean,
   * useAddItemFromLocalStorage: Boolean}} options - Configuration of this plugin
   */
  install(app, options) {
    const reactiveLocalStorageOptions = {
      useRefStorage: true,
      useLoadDataFromLocalStorage: true,
      useRemoveItemFromLocalStorage: false,
      useAddItemFromLocalStorage: false,
      ...options,
    }
    const reactiveWebStorage = {}
    const reactiveLocalStorage = createReactiveStorage(
      window.localStorage,
      reactiveLocalStorageOptions,
    )
    reactiveWebStorage.localStorage = reactiveLocalStorage
    app.config.globalProperties.$reactiveWebStorage = reactiveWebStorage
  },
}
