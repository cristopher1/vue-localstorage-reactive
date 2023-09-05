import { createReactiveStorage } from './reactiveStorage'

export default {
  /**
   * @param {App<Element>} app - Instance of createApp
   * @param {{useRefStorage: Boolean,
   * useRemoveItemFromLocalStorage: Boolean,
   * useAddItemFromLocalStorage: Boolean}} options - Configuration of this plugin
   */
  install(app, options) {
    const reactiveLocalStorageOptions = {
      useRefStorage: true,
      useRemoveItemFromLocalStorage: false,
      useAddItemFromLocalStorage: false,
      ...options,
    }
    const webStorage = window.localStorage
    const reactiveLocalStorage = createReactiveStorage(
      webStorage,
      reactiveLocalStorageOptions,
    )
    const reactiveWebStorage = {}
    reactiveWebStorage.localStorage = reactiveLocalStorage
    app.config.globalProperties.$reactiveWebStorage = reactiveWebStorage
  },
}
